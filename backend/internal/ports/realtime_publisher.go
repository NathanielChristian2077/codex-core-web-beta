package ports

import "context"

type RealtimePublisher interface {
	PublishProjectEvent(ctx context.Context, projectID string, event RealtimeEvent) error
}

type RealtimeEvent struct {
	Type    string `json:"type"`
	Payload any    `json:"payload"`
}
