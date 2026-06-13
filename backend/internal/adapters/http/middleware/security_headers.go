package middleware

import (
	"net/http"

	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/projectstream"
)

func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

		if projectstream.TryServe(w, r) {
			return
		}

		next.ServeHTTP(w, r)
	})
}
