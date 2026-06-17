package config

import (
	"net/http"
	"reflect"
	"strings"
	"testing"
	"time"
)

func TestLoadUsesSafeDevelopmentDefaults(t *testing.T) {
	t.Setenv("APP_ENV", "")
	t.Setenv("DATABASE_URL", "postgres://codex:codex@localhost:15432/codex_core?sslmode=disable")
	t.Setenv("HTTP_ADDR", "")
	t.Setenv("FRONTEND_ORIGIN", "")
	t.Setenv("RUN_MIGRATIONS", "")
	t.Setenv("AUTH_TOKEN_SECRET", "")
	t.Setenv("AUTH_SESSION_TTL", "")
	t.Setenv("AUTH_COOKIE_SECURE", "")
	t.Setenv("AUTH_COOKIE_SAMESITE", "")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() returned an unexpected error: %v", err)
	}

	if cfg.AppEnv != EnvironmentDevelopment {
		t.Fatalf("expected development environment, got %q", cfg.AppEnv)
	}
	if cfg.HTTP.Addr != ":8080" {
		t.Fatalf("expected default HTTP address, got %q", cfg.HTTP.Addr)
	}
	if !reflect.DeepEqual(cfg.HTTP.FrontendOrigins, []string{"http://localhost:5173"}) {
		t.Fatalf("unexpected frontend origins: %#v", cfg.HTTP.FrontendOrigins)
	}
	if cfg.HTTP.ReadTimeout != 10*time.Second || cfg.HTTP.WriteTimeout != 10*time.Second || cfg.HTTP.IdleTimeout != 60*time.Second {
		t.Fatalf("unexpected HTTP timeouts: %#v", cfg.HTTP)
	}
	if !cfg.Migration.AutoRun {
		t.Fatal("expected migrations to run automatically in development by default")
	}
	if cfg.Auth.TokenSecret == "" {
		t.Fatal("expected a development token secret fallback")
	}
	if cfg.Auth.CookieSecure {
		t.Fatal("expected insecure cookies in development by default")
	}
	if cfg.Auth.CookieSameSite != http.SameSiteLaxMode {
		t.Fatalf("expected SameSite=Lax, got %v", cfg.Auth.CookieSameSite)
	}
}

func TestLoadParsesExplicitEnvironmentValues(t *testing.T) {
	t.Setenv("APP_ENV", EnvironmentDevelopment)
	t.Setenv("DATABASE_URL", "postgres://example")
	t.Setenv("HTTP_ADDR", ":9090")
	t.Setenv("FRONTEND_ORIGIN", " http://localhost:5173, https://app.codex.test ,, ")
	t.Setenv("MIGRATIONS_DIR", "./migrations")
	t.Setenv("RUN_MIGRATIONS", "false")
	t.Setenv("AUTH_TOKEN_SECRET", "test-secret")
	t.Setenv("AUTH_SESSION_TTL", "2h30m")
	t.Setenv("AUTH_COOKIE_NAME", "session")
	t.Setenv("CSRF_COOKIE_NAME", "csrf")
	t.Setenv("AUTH_COOKIE_SECURE", "true")
	t.Setenv("AUTH_COOKIE_SAMESITE", "strict")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() returned an unexpected error: %v", err)
	}

	if cfg.Database.URL != "postgres://example" {
		t.Fatalf("unexpected database URL: %q", cfg.Database.URL)
	}
	if cfg.HTTP.Addr != ":9090" {
		t.Fatalf("unexpected HTTP address: %q", cfg.HTTP.Addr)
	}
	if !reflect.DeepEqual(cfg.HTTP.FrontendOrigins, []string{"http://localhost:5173", "https://app.codex.test"}) {
		t.Fatalf("unexpected frontend origins: %#v", cfg.HTTP.FrontendOrigins)
	}
	if cfg.Migration.Dir != "./migrations" || cfg.Migration.AutoRun {
		t.Fatalf("unexpected migration config: %#v", cfg.Migration)
	}
	if cfg.Auth.SessionTTL != 150*time.Minute {
		t.Fatalf("unexpected session TTL: %s", cfg.Auth.SessionTTL)
	}
	if cfg.Auth.CookieName != "session" || cfg.Auth.CSRFCookieName != "csrf" {
		t.Fatalf("unexpected cookie names: %#v", cfg.Auth)
	}
	if !cfg.Auth.CookieSecure {
		t.Fatal("expected secure cookies when explicitly enabled")
	}
	if cfg.Auth.CookieSameSite != http.SameSiteStrictMode {
		t.Fatalf("expected SameSite=Strict, got %v", cfg.Auth.CookieSameSite)
	}
}

func TestLoadRequiresDatabaseURL(t *testing.T) {
	t.Setenv("APP_ENV", EnvironmentDevelopment)
	t.Setenv("DATABASE_URL", "")

	_, err := Load()
	if err == nil {
		t.Fatal("expected Load() to reject missing DATABASE_URL")
	}
	if !strings.Contains(err.Error(), "DATABASE_URL") {
		t.Fatalf("expected DATABASE_URL error, got %v", err)
	}
}

func TestLoadRequiresTokenSecretInProduction(t *testing.T) {
	t.Setenv("APP_ENV", EnvironmentProduction)
	t.Setenv("DATABASE_URL", "postgres://example")
	t.Setenv("AUTH_TOKEN_SECRET", "")

	_, err := Load()
	if err == nil {
		t.Fatal("expected Load() to reject missing AUTH_TOKEN_SECRET in production")
	}
	if !strings.Contains(err.Error(), "AUTH_TOKEN_SECRET") {
		t.Fatalf("expected AUTH_TOKEN_SECRET error, got %v", err)
	}
}
