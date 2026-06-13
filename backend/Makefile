DATABASE_URL ?= postgres://codex:codex@localhost:15432/codex_core?sslmode=disable
MIGRATIONS_DIR ?= ./internal/adapters/postgres/migrations

.PHONY: dev build test fmt vet migrate-up migrate-down sqlc install-tools

dev:
	go run ./cmd/api

build:
	go build -o ./bin/api ./cmd/api

test:
	go test ./...

fmt:
	gofmt -w $$(find . -name '*.go')

vet:
	go vet ./...

migrate-up:
	goose -dir $(MIGRATIONS_DIR) postgres "$(DATABASE_URL)" up

migrate-down:
	goose -dir $(MIGRATIONS_DIR) postgres "$(DATABASE_URL)" down

sqlc:
	sqlc generate

install-tools:
	go install github.com/pressly/goose/v3/cmd/goose@latest
	go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
