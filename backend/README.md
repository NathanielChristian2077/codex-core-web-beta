# Codex Core Engine API

Go backend for the Codex Core Engine Web remake.

This backend is being rebuilt as a generic graph engine instead of a hardcoded RPG campaign API. RPG concepts such as events, characters, locations and objects should be implemented through presets and compatibility adapters, not as the core persistence model.

## Stack

- Go
- chi
- PostgreSQL
- pgx
- sqlc
- goose
- slog

## Local setup

Create a local environment file:

```sh
cp .env.example .env
```

Start PostgreSQL and the API from the repository root:

```sh
docker compose up --build
```

Or run only PostgreSQL with Docker and start the API directly:

```sh
make dev
```

## Health checks

```sh
curl http://localhost:8080/health
curl http://localhost:8080/ready
```

`/health` validates that the HTTP server is alive. `/ready` also validates the PostgreSQL connection.

## Development commands

```sh
make fmt
make vet
make test
make migrate-up
make migrate-down
make sqlc
```

## First milestone scope

This milestone initializes the Go backend skeleton:

- configuration loading
- structured logging
- HTTP server
- CORS and security headers
- health and readiness endpoints
- PostgreSQL connection pool
- goose migration runner
- sqlc configuration
- initial domain and port contracts

Application services, repositories, authentication endpoints and real-time project rooms come next.
