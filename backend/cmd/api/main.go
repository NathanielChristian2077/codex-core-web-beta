package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	httpadapter "github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/http"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/adapters/postgres"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/config"
	"github.com/NathanielChristian2077/codex-core-web-beta/backend/internal/logger"
)

func main() {
	if err := run(); err != nil {
		slog.Error("api stopped with error", "error", err)
		os.Exit(1)
	}
}

func run() error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	log := logger.New(cfg.AppEnv)
	slog.SetDefault(log)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	if cfg.Migration.AutoRun {
		log.Info("running database migrations", "dir", cfg.Migration.Dir)
		if err := postgres.RunMigrations(ctx, cfg.Database.URL, cfg.Migration.Dir); err != nil {
			return err
		}
	}

	pool, err := postgres.Open(ctx, cfg.Database.URL)
	if err != nil {
		return err
	}
	defer pool.Close()

	router := httpadapter.NewRouter(httpadapter.RouterDependencies{
		Config: cfg,
		DB:     pool,
		Logger: log,
	})

	server := &http.Server{
		Addr:         cfg.HTTP.Addr,
		Handler:      router,
		ReadTimeout:  cfg.HTTP.ReadTimeout,
		WriteTimeout: cfg.HTTP.WriteTimeout,
		IdleTimeout:  cfg.HTTP.IdleTimeout,
	}

	serverErrors := make(chan error, 1)
	go func() {
		log.Info("api listening", "addr", cfg.HTTP.Addr)
		serverErrors <- server.ListenAndServe()
	}()

	select {
	case err := <-serverErrors:
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return err
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		log.Info("shutting down api")
		if err := server.Shutdown(shutdownCtx); err != nil {
			return err
		}
		return nil
	}
}
