package middleware

import (
	"context"
	"crypto/subtle"
	"errors"
	"net/http"

	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/auth"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http/respond"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/config"
)

type contextKey string

const claimsContextKey contextKey = "authClaims"

type AuthMiddleware struct {
	tokens *auth.TokenService
	cfg    config.AuthConfig
}

func NewAuthMiddleware(tokens *auth.TokenService, cfg config.AuthConfig) *AuthMiddleware {
	return &AuthMiddleware{tokens: tokens, cfg: cfg}
}

func (m *AuthMiddleware) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie(m.cfg.CookieName)
		if err != nil || cookie.Value == "" {
			respond.Error(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.")
			return
		}

		claims, err := m.tokens.Verify(cookie.Value)
		if err != nil {
			status := http.StatusUnauthorized
			message := "Invalid authentication session."
			if errors.Is(err, auth.ErrExpiredToken) {
				message = "Authentication session expired."
			}
			respond.Error(w, status, "unauthorized", message)
			return
		}

		ctx := context.WithValue(r.Context(), claimsContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (m *AuthMiddleware) RequireCSRF(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet || r.Method == http.MethodHead || r.Method == http.MethodOptions {
			next.ServeHTTP(w, r)
			return
		}

		cookie, err := r.Cookie(m.cfg.CSRFCookieName)
		if err != nil || cookie.Value == "" {
			respond.Error(w, http.StatusForbidden, "csrf_required", "CSRF token cookie is missing.")
			return
		}

		header := r.Header.Get("X-CSRF-Token")
		if header == "" || subtle.ConstantTimeCompare([]byte(header), []byte(cookie.Value)) != 1 {
			respond.Error(w, http.StatusForbidden, "csrf_invalid", "CSRF token is invalid.")
			return
		}

		next.ServeHTTP(w, r)
	})
}

func ClaimsFromContext(ctx context.Context) (auth.TokenClaims, bool) {
	claims, ok := ctx.Value(claimsContextKey).(auth.TokenClaims)
	return claims, ok
}

func UserIDFromContext(ctx context.Context) (string, bool) {
	claims, ok := ClaimsFromContext(ctx)
	if !ok || claims.UserID == "" {
		return "", false
	}
	return claims.UserID, true
}
