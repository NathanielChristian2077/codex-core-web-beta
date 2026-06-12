package handlers

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
	"sync"
	"time"

	codexmiddleware "github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/middleware"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/respond"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/postgres"
	"github.com/go-chi/chi/v5"
)

const realtimeGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
const realtimeMaxFramePayloadBytes = 1 << 20

type RealtimeHandler struct {
	store  *postgres.Store
	hub    *realtimeHub
	logger *slog.Logger
}

type realtimeEvent struct {
	Type    string `json:"type"`
	Payload any    `json:"payload"`
}

type realtimeClient struct {
	outgoing  chan realtimeEvent
	done      chan struct{}
	closeOnce sync.Once
}

type realtimeRoom struct {
	projectID string
	clients   map[*realtimeClient]struct{}
	mu        sync.RWMutex
}

type realtimeHub struct {
	rooms map[string]*realtimeRoom
	mu    sync.RWMutex
}

func NewRealtimeHandler(store *postgres.Store, logger *slog.Logger) *RealtimeHandler {
	return &RealtimeHandler{store: store, logger: logger, hub: &realtimeHub{rooms: make(map[string]*realtimeRoom)}}
}

func (h *RealtimeHandler) Project(w http.ResponseWriter, r *http.Request) {
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

	conn, reader, writer, ok := acceptRealtimeConnection(w, r)
	if !ok {
		return
	}
	defer conn.Close()

	client := newRealtimeClient(64)
	room := h.hub.room(projectID)
	room.add(client)
	defer func() {
		room.remove(client)
		client.close()
		room.broadcast(realtimeEvent{Type: "presence.updated", Payload: map[string]any{"projectId": projectID, "userId": userID, "state": "left"}})
	}()

	room.broadcast(realtimeEvent{Type: "presence.updated", Payload: map[string]any{"projectId": projectID, "userId": userID, "state": "joined"}})
	client.send(realtimeEvent{Type: "project.sync", Payload: map[string]any{"projectId": projectID, "connected": true}})

	readDone := make(chan struct{})
	go func() {
		defer close(readDone)
		readRealtimeClientFrames(reader)
	}()

	for {
		select {
		case event := <-client.outgoing:
			if err := writeRealtimeEvent(writer, event); err != nil {
				if h.logger != nil {
					h.logger.Debug("realtime write failed", "error", err)
				}
				return
			}
		case <-readDone:
			_ = writeRealtimeFrame(writer, 0x8, []byte{})
			_ = writer.Flush()
			return
		case <-r.Context().Done():
			return
		case <-client.done:
			return
		}
	}
}

func (h *realtimeHub) room(projectID string) *realtimeRoom {
	h.mu.Lock()
	defer h.mu.Unlock()
	room, ok := h.rooms[projectID]
	if ok {
		return room
	}
	room = &realtimeRoom{projectID: projectID, clients: make(map[*realtimeClient]struct{})}
	h.rooms[projectID] = room
	return room
}

func newRealtimeClient(bufferSize int) *realtimeClient {
	return &realtimeClient{outgoing: make(chan realtimeEvent, bufferSize), done: make(chan struct{})}
}

func (c *realtimeClient) send(event realtimeEvent) {
	select {
	case <-c.done:
		return
	default:
	}
	select {
	case c.outgoing <- event:
	case <-c.done:
	default:
	}
}

func (c *realtimeClient) close() {
	c.closeOnce.Do(func() { close(c.done) })
}

func (r *realtimeRoom) add(client *realtimeClient) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.clients[client] = struct{}{}
}

func (r *realtimeRoom) remove(client *realtimeClient) {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.clients, client)
}

func (r *realtimeRoom) broadcast(event realtimeEvent) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	for client := range r.clients {
		client.send(event)
	}
}

func acceptRealtimeConnection(w http.ResponseWriter, r *http.Request) (net.Conn, *bufio.Reader, *bufio.Writer, bool) {
	if !strings.EqualFold(r.Header.Get("Upgrade"), "websocket") || !strings.Contains(strings.ToLower(r.Header.Get("Connection")), "upgrade") {
		respond.Error(w, http.StatusBadRequest, "realtime_upgrade_required", "Expected a WebSocket upgrade request.")
		return nil, nil, nil, false
	}

	key := strings.TrimSpace(r.Header.Get("Sec-WebSocket-Key"))
	if key == "" {
		respond.Error(w, http.StatusBadRequest, "realtime_key_required", "Sec-WebSocket-Key is required.")
		return nil, nil, nil, false
	}

	hijacker, ok := w.(http.Hijacker)
	if !ok {
		respond.Error(w, http.StatusInternalServerError, "realtime_unsupported", "Server does not support connection hijacking.")
		return nil, nil, nil, false
	}

	conn, rw, err := hijacker.Hijack()
	if err != nil {
		respond.Error(w, http.StatusInternalServerError, "realtime_upgrade_failed", "Could not upgrade connection.")
		return nil, nil, nil, false
	}

	accept := realtimeAcceptKey(key)
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

func realtimeAcceptKey(key string) string {
	sum := sha1.Sum([]byte(key + realtimeGUID))
	return base64.StdEncoding.EncodeToString(sum[:])
}

func readRealtimeClientFrames(reader *bufio.Reader) {
	for {
		opcode, _, err := readRealtimeFrame(reader)
		if err != nil {
			return
		}
		switch opcode {
		case 0x8:
			return
		default:
			continue
		}
	}
}

func readRealtimeFrame(reader *bufio.Reader) (byte, []byte, error) {
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
		return 0, nil, errors.New("client realtime frames must be masked")
	}
	if length > realtimeMaxFramePayloadBytes {
		return 0, nil, errors.New("realtime frame payload is too large")
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

func writeRealtimeEvent(writer *bufio.Writer, event realtimeEvent) error {
	payload, err := json.Marshal(event)
	if err != nil {
		return err
	}
	return writeRealtimeFrame(writer, 0x1, payload)
}

func writeRealtimeFrame(writer *bufio.Writer, opcode byte, payload []byte) error {
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
