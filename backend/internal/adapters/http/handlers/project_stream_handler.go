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

const projectStreamGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
const projectStreamMaxFramePayloadBytes = 1 << 20

type ProjectStreamHandler struct {
	store  *postgres.Store
	hub    *projectStreamHub
	logger *slog.Logger
}

type projectStreamEvent struct {
	Type    string `json:"type"`
	Payload any    `json:"payload"`
}

type projectStreamClient struct {
	outgoing  chan projectStreamEvent
	done      chan struct{}
	closeOnce sync.Once
}

type projectStreamRoom struct {
	projectID string
	clients   map[*projectStreamClient]struct{}
	mu        sync.RWMutex
}

type projectStreamHub struct {
	rooms map[string]*projectStreamRoom
	mu    sync.RWMutex
}

func NewProjectStreamHandler(store *postgres.Store, logger *slog.Logger) *ProjectStreamHandler {
	return &ProjectStreamHandler{store: store, logger: logger, hub: &projectStreamHub{rooms: make(map[string]*projectStreamRoom)}}
}

func (h *ProjectStreamHandler) Project(w http.ResponseWriter, r *http.Request) {
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

	conn, reader, writer, ok := acceptProjectStreamConnection(w, r)
	if !ok {
		return
	}
	defer conn.Close()

	client := newProjectStreamClient(64)
	room := h.hub.room(projectID)
	room.add(client)
	defer func() {
		room.remove(client)
		client.close()
		room.broadcast(projectStreamEvent{Type: "presence.updated", Payload: map[string]any{"projectId": projectID, "userId": userID, "state": "left"}})
	}()

	room.broadcast(projectStreamEvent{Type: "presence.updated", Payload: map[string]any{"projectId": projectID, "userId": userID, "state": "joined"}})
	client.send(projectStreamEvent{Type: "project.sync", Payload: map[string]any{"projectId": projectID, "connected": true}})

	readDone := make(chan struct{})
	go func() {
		defer close(readDone)
		readProjectStreamClientFrames(reader)
	}()

	for {
		select {
		case event := <-client.outgoing:
			if err := writeProjectStreamEvent(writer, event); err != nil {
				if h.logger != nil {
					h.logger.Debug("project stream write failed", "error", err)
				}
				return
			}
		case <-readDone:
			_ = writeProjectStreamFrame(writer, 0x8, []byte{})
			_ = writer.Flush()
			return
		case <-r.Context().Done():
			return
		case <-client.done:
			return
		}
	}
}

func (h *projectStreamHub) room(projectID string) *projectStreamRoom {
	h.mu.Lock()
	defer h.mu.Unlock()
	room, ok := h.rooms[projectID]
	if ok {
		return room
	}
	room = &projectStreamRoom{projectID: projectID, clients: make(map[*projectStreamClient]struct{})}
	h.rooms[projectID] = room
	return room
}

func newProjectStreamClient(bufferSize int) *projectStreamClient {
	return &projectStreamClient{outgoing: make(chan projectStreamEvent, bufferSize), done: make(chan struct{})}
}

func (c *projectStreamClient) send(event projectStreamEvent) {
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

func (c *projectStreamClient) close() {
	c.closeOnce.Do(func() { close(c.done) })
}

func (r *projectStreamRoom) add(client *projectStreamClient) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.clients[client] = struct{}{}
}

func (r *projectStreamRoom) remove(client *projectStreamClient) {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.clients, client)
}

func (r *projectStreamRoom) broadcast(event projectStreamEvent) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	for client := range r.clients {
		client.send(event)
	}
}

func acceptProjectStreamConnection(w http.ResponseWriter, r *http.Request) (net.Conn, *bufio.Reader, *bufio.Writer, bool) {
	if !strings.EqualFold(r.Header.Get("Upgrade"), "websocket") || !strings.Contains(strings.ToLower(r.Header.Get("Connection")), "upgrade") {
		respond.Error(w, http.StatusBadRequest, "stream_upgrade_required", "Expected a WebSocket upgrade request.")
		return nil, nil, nil, false
	}

	key := strings.TrimSpace(r.Header.Get("Sec-WebSocket-Key"))
	if key == "" {
		respond.Error(w, http.StatusBadRequest, "stream_key_required", "Sec-WebSocket-Key is required.")
		return nil, nil, nil, false
	}

	hijacker, ok := w.(http.Hijacker)
	if !ok {
		respond.Error(w, http.StatusInternalServerError, "stream_unsupported", "Server does not support connection hijacking.")
		return nil, nil, nil, false
	}

	conn, rw, err := hijacker.Hijack()
	if err != nil {
		respond.Error(w, http.StatusInternalServerError, "stream_upgrade_failed", "Could not upgrade connection.")
		return nil, nil, nil, false
	}

	accept := projectStreamAcceptKey(key)
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

func projectStreamAcceptKey(key string) string {
	sum := sha1.Sum([]byte(key + projectStreamGUID))
	return base64.StdEncoding.EncodeToString(sum[:])
}

func readProjectStreamClientFrames(reader *bufio.Reader) {
	for {
		opcode, _, err := readProjectStreamFrame(reader)
		if err != nil {
			return
		}
		if opcode == 0x8 {
			return
		}
	}
}

func readProjectStreamFrame(reader *bufio.Reader) (byte, []byte, error) {
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
		return 0, nil, errors.New("client stream frames must be masked")
	}
	if length > projectStreamMaxFramePayloadBytes {
		return 0, nil, errors.New("stream frame payload is too large")
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

func writeProjectStreamEvent(writer *bufio.Writer, event projectStreamEvent) error {
	payload, err := json.Marshal(event)
	if err != nil {
		return err
	}
	return writeProjectStreamFrame(writer, 0x1, payload)
}

func writeProjectStreamFrame(writer *bufio.Writer, opcode byte, payload []byte) error {
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
