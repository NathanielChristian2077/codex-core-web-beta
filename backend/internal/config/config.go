package config

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

const (
	EnvironmentDevelopment = "development"
	EnvironmentProduction  = "production"
)

type Config struct {
	AppEnv    string
	HTTP      HTTPConfig
	Database  DatabaseConfig
	Migration MigrationConfig
	Auth      AuthConfig
}

type HTTPConfig struct {
	Addr            string
	FrontendOrigins []string
	ReadTimeout     time.Duration
	WriteTimeout    time.Duration
	IdleTimeout     time.Duration
}

type DatabaseConfig struct {
	URL string
}

type MigrationConfig struct {
	Dir     string
	AutoRun bool
}

type AuthConfig struct {
	TokenSecret    string
	SessionTTL     time.Duration
	CookieName     string
	CSRFCookieName string
	CookieSecure   bool
	CookieSameSite http.SameSite
}

func Load() (Config, error) {
	_ = godotenv.Load()

	appEnv := getEnv("APP_ENV", EnvironmentDevelopment)
	isProduction := appEnv == EnvironmentProduction

	cfg := Config{
		AppEnv: appEnv,
		HTTP: HTTPConfig{
			Addr:            getEnv("HTTP_ADDR", ":8080"),
			FrontendOrigins: splitCSV(getEnv("FRONTEND_ORIGIN", "http://localhost:5173")),
			ReadTimeout:     10 * time.Second,
			WriteTimeout:    10 * time.Second,
			IdleTimeout:     60 * time.Second,
		},
		Database: DatabaseConfig{
			URL: getEnv("DATABASE_URL", ""),
		},
		Migration: MigrationConfig{
			Dir:     getEnv("MIGRATIONS_DIR", "internal/adapters/postgres/migrations"),
			AutoRun: getBoolEnv("RUN_MIGRATIONS", true),
		},
		Auth: AuthConfig{
			TokenSecret:    getEnv("AUTH_TOKEN_SECRET", defaultDevelopmentTokenSecret(isProduction)),
			SessionTTL:     getDurationEnv("AUTH_SESSION_TTL", 24*time.Hour),
			CookieName:     getEnv("AUTH_COOKIE_NAME", "codex_session"),
			CSRFCookieName: getEnv("CSRF_COOKIE_NAME", "XSRF-TOKEN"),
			CookieSecure:   getBoolEnv("AUTH_COOKIE_SECURE", isProduction),
			CookieSameSite: getSameSiteEnv("AUTH_COOKIE_SAMESITE", http.SameSiteLaxMode),
		},
	}

	if cfg.Database.URL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required")
	}

	if isProduction && cfg.Auth.TokenSecret == "" {
		return Config{}, fmt.Errorf("AUTH_TOKEN_SECRET is required in production")
	}

	return cfg, nil
}

func (c Config) IsProduction() bool {
	return c.AppEnv == EnvironmentProduction
}

func getEnv(key string, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func getBoolEnv(key string, fallback bool) bool {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	parsed, err := strconv.ParseBool(value)
	if err != nil {
		return fallback
	}
	return parsed
}

func getDurationEnv(key string, fallback time.Duration) time.Duration {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	parsed, err := time.ParseDuration(value)
	if err != nil {
		return fallback
	}
	return parsed
}

func getSameSiteEnv(key string, fallback http.SameSite) http.SameSite {
	switch strings.ToLower(strings.TrimSpace(os.Getenv(key))) {
	case "strict":
		return http.SameSiteStrictMode
	case "lax":
		return http.SameSiteLaxMode
	case "none":
		return http.SameSiteNoneMode
	default:
		return fallback
	}
}

func splitCSV(value string) []string {
	parts := strings.Split(value, ",")
	out := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			out = append(out, trimmed)
		}
	}
	return out
}

func defaultDevelopmentTokenSecret(isProduction bool) string {
	if isProduction {
		return ""
	}
	return "codex-core-development-token-secret-change-before-production"
}
