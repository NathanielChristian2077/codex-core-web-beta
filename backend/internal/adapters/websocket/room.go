package websocket

import "sync"

type Room struct {
	projectID string
	clients   map[*Client]struct{}
	mu        sync.RWMutex
}

func NewRoom(projectID string) *Room {
	return &Room{
		projectID: projectID,
		clients:   make(map[*Client]struct{}),
	}
}

func (r *Room) Add(client *Client) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.clients[client] = struct{}{}
}

func (r *Room) Remove(client *Client) {
	r.mu.Lock()
	defer r.mu.Unlock()
	delete(r.clients, client)
}

func (r *Room) Broadcast(event ServerEvent) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for client := range r.clients {
		client.Send(event)
	}
}
