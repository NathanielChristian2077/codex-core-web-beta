package logger

import (
	"log/slog"
	"os"

	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/config"
)

func New(environment string) *slog.Logger {
	level := slog.LevelInfo
	if environment == config.EnvironmentDevelopment {
		level = slog.LevelDebug
	}

	options := &slog.HandlerOptions{
		Level: level,
	}

	if environment == config.EnvironmentProduction {
		return slog.New(slog.NewJSONHandler(os.Stdout, options))
	}

	return slog.New(slog.NewTextHandler(os.Stdout, options))
}
