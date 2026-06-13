package projectstream

import (
	"bufio"
	"context"
	"crypto/sha1"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/auth"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/respond"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/postgres"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/config"
	"github.com/jackc/pgx/v5/pgxpool"
)

const guid = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
const maxFramePayloadBytes = 1 << 20

type service struct {
	cfg    config.Config
	pool   *pgxpool.Pool
	store  *postgres.Store
	tokens *auth.TokenService
	hub    *hub
}

type event struct {
	Type    string `json:"type"`
	Payload any    `json:"payload"`
}

type client struct {
	outgoing  chan event
	done      chan struct{}
	closeOnce sync.Once
}

type room struct {
	clients map[*client]struct{}
	mu      sync.RWMutex
}

type hub struct {
	rooms map[string]*room
	mu    sync.RWMutex
}

var (
	instance     *service
	instanceErr  error
	instanceOnce sync.Once
)

func TryServe(w http.ResponseWriter, r *http.Request) bool {
	projectID, ok := projectIDFromPath(r.URL.Path)
	if !ok {
		return false
	}

	svc, err := getService(r.Context())
	if err != nil {
		respond.Error(w, http.StatusServiceUnavailable, "project_stream_unavailable", "Project stream service is unavailable.")
		return true
	}
	svc.startNotificationListener()

	svc.serve(projectID, w, r)
	return true
}

func getService(ctx context.Context) (*service, error) {
	instanceOnce.Do(func() {
		cfg, err := config.Load()
		if err != nil {
			instanceErr = err
			return
		}
		pool, err := postgres.Open(ctx, cfg.Database.URL)
		if err != nil {
			instanceErr = err
			return
		}
		instance = &service{
			cfg:    cfg,
			pool:   pool,
			store:  postgres.NewStore(pool),
			tokens: auth.NewTokenService(cfg.Auth.TokenSecret, cfg.Auth.SessionTTL),
			hub:    &hub{rooms: make(map[string]*room)},
		}
	})
	return instance, instanceErr
}

func (s *service) serve(projectID string, w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(s.cfg.Auth.CookieName)
	if err != nil || cookie.Value == "" {
		respond.Error(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.")
		return
	}
	claims, err := s.tokens.Verify(cookie.Value)
	if err != nil {
		respond.Error(w, http.StatusUnauthorized, "unauthorized", "Invalid authentication session.")
		return
	}
	allowed, err := s.store.UserCanAccessProject(r.Context(), claims.UserID, projectID)
	if err != nil || !allowed {
		respond.Error(w, http.StatusNotFound, "project_not_found", "Project not found.")
		return
	}

	conn, reader, writer, ok := accept(w, r)
	if !ok {
		return
	}
	defer conn.Close()

	client := newClient(64)
	room := s.hub.room(projectID)
	room.add(client)
	defer func() {
		room.remove(client)
		client.close()
		room.broadcast(event{Type: "presence.updated", Payload: map[string]any{"projectId": projectID, "userId": claims.UserID, "state": "left"}})
	}()

	room.broadcast(event{Type: "presence.updated", Payload: map[string]any{"projectId": projectID, "userId": claims.UserID, "state": "joined"}})
	client.send(event{Type: "project.sync", Payload: map[string]any{"projectId": projectID, "connected": true}})

	readDone := make(chan struct{})
	go func() {
		defer close(readDone)
		readClientFrames(reader)
	}()

	for {
		select {
		case event := <-client.outgoing:
			if err := writeEvent(writer, event); err != nil {
				return
			}
		case <-readDone:
			_ = writeFrame(writer, 0x8, []byte{})
			_ = writer.Flush()
			return
		case <-r.Context().Done():
			return
		case <-client.done:
			return
		}
	}
}

func projectIDFromPath(path string) (string, bool) {
	prefix := "/" + "ws" + "/projects/"
	projectID := strings.TrimPrefix(path, prefix)
	if projectID == path || projectID == "" || strings.Contains(projectID, "/") {
		return "", false
	}
	return projectID, true
}

func (h *hub) room(projectID string) *room {
	h.mu.Lock()
	defer h.mu.Unlock()
	nuroom, ok := h.rooms[projectID]
	if ok {
		return nuroom
	}
	nuroom = &room{clients: make(map[*client]struct{})}
	h.rooms[projectID] = nuroom
	return nuroom
}

func newClient(bufferSize int) *client {
	return &client{outgoing: make(chan event, bufferSize), done: make(chan struct{})}
}

func (c *client) send(e event) {
	select {
	case <-c.done:
		return
	default:
	}
	select {
	case c.outgoing <- e:
	case <-c.done:
	default:
	}
}

func (c *client) close() {
	c.closeOnce.Do(func() { close(c.done) })
}

func (r *room) add(client *client) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.clients[client] = struct{}{}
}

func (r *room) remove(client *client) {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.clients, client)
}

func (r *room) broadcast(e event) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	for client := range r.clients {
		client.send(e)
	}
}

func accept(w http.ResponseWriter, r *http.Request) (net.Conn, *bufio.Reader, *bufio.Writer, bool) {
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
	acceptKey := acceptKey(key)
	_, err = fmt.Fprintf(rw, "HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: %s\r\n\r\n", acceptKey)
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

func acceptKey(key string) string {
	sum := sha1.Sum([]byte(key + guid))
	return base64.StdEncoding.EncodeToString(sum[:])
}

func readClientFrames(reader *bufio.Reader) {
	for {
		opcode, _, err := readFrame(reader)
		if err != nil || opcode == 0x8 {
			return
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

func writeEvent(writer *bufio.Writer, e event) error {
	payload, err := json.Marshal(e)
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
