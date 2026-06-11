package httpadapter

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/handlers"
	codexmiddleware "github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/middleware"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/respond"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/config"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RouterDependencies struct {
	Config config.Config
	DB     *pgxpool.Pool
	Logger *slog.Logger
}

func NewRouter(deps RouterDependencies) http.Handler {
	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Timeout(60 * time.Second))
	router.Use(codexmiddleware.SecurityHeaders)
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   deps.Config.HTTP.FrontendOrigins,
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodOptions},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	healthHandler := handlers.NewHealthHandler(deps.DB)

	router.Get("/health", healthHandler.Live)
	router.Get("/ready", healthHandler.Ready)

	router.NotFound(func(w http.ResponseWriter, r *http.Request) {
		respond.Error(w, http.StatusNotFound, "not_found", "Route not found.")
	})

	router.MethodNotAllowed(func(w http.ResponseWriter, r *http.Request) {
		respond.Error(w, http.StatusMethodNotAllowed, "method_not_allowed", "Method not allowed for this route.")
	})

	return router
}
