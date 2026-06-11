package websocket

import "sync"

type Hub struct {
	rooms map[string]*Room
	mu    sync.RWMutex
}

func NewHub() *Hub {
	return &Hub{rooms: make(map[string]*Room)}
}

func (h *Hub) Room(projectID string) *Room {
	h.mu.Lock()
	defer h.mu.Unlock()

	room, ok := h.rooms[projectID]
	if ok {
		return room
	}

	room = NewRoom(projectID)
	h.rooms[projectID] = room
	return room
}
