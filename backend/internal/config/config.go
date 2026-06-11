package config

import (
	"fmt"
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

func Load() (Config, error) {
	_ = godotenv.Load()

	cfg := Config{
		AppEnv: getEnv("APP_ENV", EnvironmentDevelopment),
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
	}

	if cfg.Database.URL == "" {
		return Config{}, fmt.Errorf("DATABASE_URL is required")
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
