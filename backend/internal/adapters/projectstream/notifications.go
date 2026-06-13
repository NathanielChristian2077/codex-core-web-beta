package projectstream

import (
	"context"
	"encoding/json"
	"log/slog"
	"time"

	"github.com/jackc/pgx/v5"
)

type databaseEvent struct {
	Type      string          `json:"type"`
	ProjectID string          `json:"projectId"`
	Payload   json.RawMessage `json:"payload"`
}

var listenerOnce syncOnce

type syncOnce struct {
	ch chan struct{}
}

func (o *syncOnce) Do(fn func()) {
	if o.ch == nil {
		o.ch = make(chan struct{})
		go func() {
			fn()
			close(o.ch)
		}()
	}
}

func (s *service) startNotificationListener() {
	listenerOnce.Do(func() {
		for {
			if err := s.listenProjectEvents(context.Background()); err != nil {
				slog.Warn("project event listener stopped", "error", err)
				time.Sleep(2 * time.Second)
			}
		}
	})
}

func (s *service) listenProjectEvents(ctx context.Context) error {
	conn, err := s.pool.Acquire(ctx)
	if err != nil {
		return err
	}
	defer conn.Release()

	if _, err := conn.Exec(ctx, "LISTEN codex_project_events"); err != nil {
		return err
	}

	for {
		notification, err := conn.Conn().WaitForNotification(ctx)
		if err != nil {
			if err == pgx.ErrNoRows {
				continue
			}
			return err
		}

		var dbEvent databaseEvent
		if err := json.Unmarshal([]byte(notification.Payload), &dbEvent); err != nil {
			continue
		}
		if dbEvent.ProjectID == "" || dbEvent.Type == "" {
			continue
		}

		s.hub.broadcast(dbEvent.ProjectID, event{
			Type:    dbEvent.Type,
			Payload: dbEvent.Payload,
		})
	}
}

func (h *hub) broadcast(projectID string, e event) {
	h.room(projectID).broadcast(e)
}
