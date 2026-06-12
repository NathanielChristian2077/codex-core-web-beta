package httpadapter

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/auth"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/handlers"
	codexmiddleware "github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/middleware"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/respond"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/postgres"
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

	store := postgres.NewStore(deps.DB)
	tokenService := auth.NewTokenService(deps.Config.Auth.TokenSecret, deps.Config.Auth.SessionTTL)
	authMiddleware := codexmiddleware.NewAuthMiddleware(tokenService, deps.Config.Auth)
	healthHandler := handlers.NewHealthHandler(deps.DB)
	authHandler := handlers.NewAuthHandler(store, tokenService, deps.Config.Auth)
	resourceHandler := handlers.NewResourceHandler(store)
	membershipHandler := handlers.NewMembershipHandler(store)

	router.Get("/health", healthHandler.Live)
	router.Get("/ready", healthHandler.Ready)

	router.Route("/auth", func(r chi.Router) {
		r.Get("/csrf", authHandler.CSRF)
		r.Post("/register", authHandler.Register)
		r.Post("/login", authHandler.Login)

		r.Group(func(protected chi.Router) {
			protected.Use(authMiddleware.RequireAuth)
			protected.Use(authMiddleware.RequireCSRF)
			protected.Get("/me", authHandler.Me)
			protected.Patch("/me", authHandler.UpdateMe)
			protected.Patch("/me/password", authHandler.ChangePassword)
			protected.Delete("/me", authHandler.DeleteMe)
			protected.Post("/logout", authHandler.Logout)
		})
	})

	router.Group(func(protected chi.Router) {
		protected.Use(authMiddleware.RequireAuth)
		protected.Use(authMiddleware.RequireCSRF)

		protected.Get("/projects", resourceHandler.ListProjects)
		protected.Post("/projects", resourceHandler.CreateProject)
		protected.Get("/projects/{projectID}", resourceHandler.GetProject)
		protected.Patch("/projects/{projectID}", resourceHandler.UpdateProject)
		protected.Delete("/projects/{projectID}", resourceHandler.DeleteProject)
		protected.Post("/projects/{projectID}/presets", resourceHandler.ApplyPreset)

		protected.Get("/projects/{projectID}/members", membershipHandler.ListMembers)
		protected.Post("/projects/{projectID}/members", membershipHandler.AddMember)
		protected.Patch("/projects/{projectID}/members/{userID}", membershipHandler.UpdateMemberRole)
		protected.Delete("/projects/{projectID}/members/{userID}", membershipHandler.RemoveMember)

		protected.Get("/projects/{projectID}/node-types", resourceHandler.ListNodeTypes)
		protected.Post("/projects/{projectID}/node-types", resourceHandler.CreateNodeType)
		protected.Patch("/node-types/{nodeTypeID}", resourceHandler.UpdateNodeType)
		protected.Delete("/node-types/{nodeTypeID}", resourceHandler.DeleteNodeType)

		protected.Get("/projects/{projectID}/edge-types", resourceHandler.ListEdgeTypes)
		protected.Post("/projects/{projectID}/edge-types", resourceHandler.CreateEdgeType)
		protected.Patch("/edge-types/{edgeTypeID}", resourceHandler.UpdateEdgeType)
		protected.Delete("/edge-types/{edgeTypeID}", resourceHandler.DeleteEdgeType)

		protected.Get("/projects/{projectID}/nodes", resourceHandler.ListNodes)
		protected.Post("/projects/{projectID}/nodes", resourceHandler.CreateNode)
		protected.Get("/nodes/{nodeID}", resourceHandler.GetNode)
		protected.Patch("/nodes/{nodeID}", resourceHandler.UpdateNode)
		protected.Delete("/nodes/{nodeID}", resourceHandler.DeleteNode)

		protected.Get("/projects/{projectID}/edges", resourceHandler.ListEdges)
		protected.Post("/projects/{projectID}/edges", resourceHandler.CreateEdge)
		protected.Patch("/edges/{edgeID}", resourceHandler.UpdateEdge)
		protected.Delete("/edges/{edgeID}", resourceHandler.DeleteEdge)

		protected.Get("/projects/{projectID}/graph", resourceHandler.GetGraph)

		protected.Get("/projects/{projectID}/views", resourceHandler.ListViews)
		protected.Post("/projects/{projectID}/views", resourceHandler.CreateView)
		protected.Patch("/views/{viewID}", resourceHandler.UpdateView)
		protected.Delete("/views/{viewID}", resourceHandler.DeleteView)
		protected.Get("/views/{viewID}/layout", resourceHandler.ListLayouts)
		protected.Put("/views/{viewID}/layout/nodes/{nodeID}", resourceHandler.UpsertLayout)

		protected.Get("/campaigns", resourceHandler.ListProjects)
		protected.Post("/campaigns", resourceHandler.CreateProject)
		protected.Get("/campaigns/{projectID}", resourceHandler.GetProject)
		protected.Put("/campaigns/{projectID}", resourceHandler.UpdateProject)
		protected.Delete("/campaigns/{projectID}", resourceHandler.DeleteProject)
		protected.Get("/campaigns/{projectID}/graph", resourceHandler.GetGraph)
	})

	router.NotFound(func(w http.ResponseWriter, r *http.Request) {
		respond.Error(w, http.StatusNotFound, "not_found", "Route not found.")
	})

	router.MethodNotAllowed(func(w http.ResponseWriter, r *http.Request) {
		respond.Error(w, http.StatusMethodNotAllowed, "method_not_allowed", "Method not allowed for this route.")
	})

	return router
}
