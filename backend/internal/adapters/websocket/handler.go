package websocket

import (
	"bufio"
	"crypto/sha1"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net"
	"net/http"
	"strings"
	"time"

	codexmiddleware "github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/middleware"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/respond"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/postgres"
	"github.com/go-chi/chi/v5"
)

const websocketGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
const maxFramePayloadBytes = 1 << 20

type Handler struct {
	hub    *Hub
	store  *postgres.Store
	logger *slog.Logger
}

func NewHandler(hub *Hub, store *postgres.Store, logger *slog.Logger) *Handler {
	return &Handler{hub: hub, store: store, logger: logger}
}

func (h *Handler) Project(w http.ResponseWriter, r *http.Request) {
	projectID := chi.URLParam(r, "projectID")
	userID, ok := codexmiddleware.UserIDFromContext(r.Context())
	if !ok {
		respond.Error(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.")
		return
	}

	allowed, err := h.store.UserCanAccessProject(r.Context(), userID, projectID)
	if err != nil || !allowed {
		respond.Error(w, http.StatusNotFound, "project_not_found", "Project not found.")
		return
	}

	conn, reader, writer, ok := acceptConnection(w, r)
	if !ok {
		return
	}
	defer conn.Close()

	client := NewClient(64)
	room := h.hub.Room(projectID)
	room.Add(client)
	defer func() {
		room.Remove(client)
		client.Close()
		room.Broadcast(ServerEvent{Type: "presence.updated", Payload: map[string]any{"projectId": projectID, "userId": userID, "state": "left"}})
	}()

	room.Broadcast(ServerEvent{Type: "presence.updated", Payload: map[string]any{"projectId": projectID, "userId": userID, "state": "joined"}})
	client.Send(ServerEvent{Type: "project.sync", Payload: map[string]any{"projectId": projectID, "connected": true}})

	readDone := make(chan struct{})
	go func() {
		defer close(readDone)
		readClientFrames(reader)
	}()

	for {
		select {
		case event := <-client.Outgoing():
			if err := writeServerEvent(writer, event); err != nil {
				if h.logger != nil {
					h.logger.Debug("websocket write failed", "error", err)
				}
				return
			}
		case <-readDone:
			_ = writeFrame(writer, 0x8, []byte{})
			_ = writer.Flush()
			return
		case <-r.Context().Done():
			return
		case <-client.Done():
			return
		}
	}
}

func acceptConnection(w http.ResponseWriter, r *http.Request) (net.Conn, *bufio.Reader, *bufio.Writer, bool) {
	if !strings.EqualFold(r.Header.Get("Upgrade"), "websocket") || !strings.Contains(strings.ToLower(r.Header.Get("Connection")), "upgrade") {
		respond.Error(w, http.StatusBadRequest, "websocket_required", "Expected a WebSocket upgrade request.")
		return nil, nil, nil, false
	}

	key := strings.TrimSpace(r.Header.Get("Sec-WebSocket-Key"))
	if key == "" {
		respond.Error(w, http.StatusBadRequest, "websocket_key_required", "Sec-WebSocket-Key is required.")
		return nil, nil, nil, false
	}

	hijacker, ok := w.(http.Hijacker)
	if !ok {
		respond.Error(w, http.StatusInternalServerError, "websocket_unsupported", "Server does not support connection hijacking.")
		return nil, nil, nil, false
	}

	conn, rw, err := hijacker.Hijack()
	if err != nil {
		respond.Error(w, http.StatusInternalServerError, "websocket_upgrade_failed", "Could not upgrade connection.")
		return nil, nil, nil, false
	}

	accept := websocketAcceptKey(key)
	_, err = fmt.Fprintf(rw, "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: %s\r\n\r\n", accept)
	if err != nil {
		_ = conn.Close()
		return nil, nil, nil, false
	}
	if err := rw.Flush(); err != nil {
		_ = conn.Close()
		return nil, nil, nil, false
	}

	_ = conn.SetDeadline(time.Time{})
	return conn, rw.Reader, rw.Writer, true
}

func websocketAcceptKey(key string) string {
	sum := sha1.Sum([]byte(key + websocketGUID))
	return base64.StdEncoding.EncodeToString(sum[:])
}

func readClientFrames(reader *bufio.Reader) {
	for {
		opcode, _, err := readFrame(reader)
		if err != nil {
			return
		}
		switch opcode {
		case 0x8:
			return
		case 0x1, 0x2, 0x9, 0xA:
			continue
		default:
			continue
		}
	}
}

func readFrame(reader *bufio.Reader) (byte, []byte, error) {
	var header [2]byte
	if _, err := io.ReadFull(reader, header[:]); err != nil {
		return 0, nil, err
	}

	opcode := header[0] & 0x0F
	masked := header[1]&0x80 != 0
	length := uint64(header[1] & 0x7F)

	switch length {
	case 126:
		var extended [2]byte
		if _, err := io.ReadFull(reader, extended[:]); err != nil {
			return 0, nil, err
		}
		length = uint64(binary.BigEndian.Uint16(extended[:]))
	case 127:
		var extended [8]byte
		if _, err := io.ReadFull(reader, extended[:]); err != nil {
			return 0, nil, err
		}
		length = binary.BigEndian.Uint64(extended[:])
	}

	if !masked {
		return 0, nil, errors.New("client websocket frames must be masked")
	}
	if length > maxFramePayloadBytes {
		return 0, nil, errors.New("websocket frame payload is too large")
	}

	var mask [4]byte
	if _, err := io.ReadFull(reader, mask[:]); err != nil {
		return 0, nil, err
	}

	payload := make([]byte, length)
	if _, err := io.ReadFull(reader, payload); err != nil {
		return 0, nil, err
	}
	for i := range payload {
		payload[i] ^= mask[i%4]
	}
	return opcode, payload, nil
}

func writeServerEvent(writer *bufio.Writer, event ServerEvent) error {
	payload, err := json.Marshal(event)
	if err != nil {
		return err
	}
	return writeFrame(writer, 0x1, payload)
}

func writeFrame(writer *bufio.Writer, opcode byte, payload []byte) error {
	first := byte(0x80) | (opcode & 0x0F)
	if err := writer.WriteByte(first); err != nil {
		return err
	}

	length := len(payload)
	switch {
	case length <= 125:
		if err := writer.WriteByte(byte(length)); err != nil {
			return err
		}
	case length <= 65535:
		if err := writer.WriteByte(126); err != nil {
			return err
		}
		var extended [2]byte
		binary.BigEndian.PutUint16(extended[:], uint16(length))
		if _, err := writer.Write(extended[:]); err != nil {
			return err
		}
	default:
		if err := writer.WriteByte(127); err != nil {
			return err
		}
		var extended [8]byte
		binary.BigEndian.PutUint64(extended[:], uint64(length))
		if _, err := writer.Write(extended[:]); err != nil {
			return err
		}
	}

	if _, err := writer.Write(payload); err != nil {
		return err
	}
	return writer.Flush()
}
