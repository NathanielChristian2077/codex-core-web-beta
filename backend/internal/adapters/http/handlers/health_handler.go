package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/respond"
	"github.com/jackc/pgx/v5/pgxpool"
)

type HealthHandler struct {
	db *pgxpool.Pool
}

func NewHealthHandler(db *pgxpool.Pool) *HealthHandler {
	return &HealthHandler{db: db}
}

func (h *HealthHandler) Live(w http.ResponseWriter, r *http.Request) {
	respond.JSON(w, http.StatusOK, map[string]string{
		"status":  "ok",
		"service": "codex-core-engine-api",
	})
}

func (h *HealthHandler) Ready(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()

	if err := h.db.Ping(ctx); err != nil {
		respond.Error(w, http.StatusServiceUnavailable, "database_unavailable", "Database connection is not ready.")
		return
	}

	respond.JSON(w, http.StatusOK, map[string]string{
		"status":  "ready",
		"service": "codex-core-engine-api",
	})
}
