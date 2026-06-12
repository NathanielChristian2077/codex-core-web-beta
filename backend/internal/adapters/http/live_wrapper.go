package httpadapter

import (
	"context"
	"net/http"
	"strings"

	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/auth"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/handlers"
	codexmiddleware "github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/middleware"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/postgres"
	"github.com/go-chi/chi/v5"
)

func WithProjectStreams(next http.Handler, deps RouterDependencies) http.Handler {
	store := postgres.NewStore(deps.DB)
	tokenService := auth.NewTokenService(deps.Config.Auth.TokenSecret, deps.Config.Auth.SessionTTL)
	authMiddleware := codexmiddleware.NewAuthMiddleware(tokenService, deps.Config.Auth)
	projectStreamHandler := handlers.NewProjectStreamHandler(store, deps.Logger)
	protectedProjectStream := authMiddleware.RequireAuth(http.HandlerFunc(projectStreamHandler.Project))

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		projectID, ok := projectIDFromLivePath(r.URL.Path)
		if !ok {
			next.ServeHTTP(w, r)
			return
		}

		routeContext := chi.NewRouteContext()
		routeContext.URLParams.Add("projectID", projectID)
		ctx := context.WithValue(r.Context(), chi.RouteCtxKey, routeContext)
		protectedProjectStream.ServeHTTP(w, r.WithContext(ctx))
	})
}

func projectIDFromLivePath(path string) (string, bool) {
	prefix := "/" + "ws" + "/projects/"
	projectID := strings.TrimPrefix(path, prefix)
	if projectID == path || projectID == "" || strings.Contains(projectID, "/") {
		return "", false
	}
	return projectID, true
}
