#!/usr/bin/env bash

# Codex Core Engine Web setup script.
# Run from the repository root:
#   chmod +x setup.sh
#   ./setup.sh
#
# Optional flags through env vars:
#   START_API_CONTAINER=true ./setup.sh   # also build/start the Go API container
#   RUN_CHECKS=true ./setup.sh            # run Go tests and frontend build
#   INSTALL_GO_TOOLS=true ./setup.sh      # install goose/sqlc CLIs locally through Go

set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

START_API_CONTAINER="${START_API_CONTAINER:-false}"
RUN_CHECKS="${RUN_CHECKS:-false}"
INSTALL_GO_TOOLS="${INSTALL_GO_TOOLS:-false}"

FRONTEND_ORIGIN="${FRONTEND_ORIGIN:-http://localhost:5173}"
API_URL="${VITE_API_URL:-http://localhost:8080}"

BACKEND_ENV_FILE="$ROOT_DIR/backend/.env"
FRONTEND_ENV_FILE="$ROOT_DIR/frontend/.env.local"

COMPOSE_FILES=(-f docker-compose.yml)

if [[ -f docker-compose.override.yml ]]; then
  COMPOSE_FILES+=(-f docker-compose.override.yml)
fi

compose() {
  docker compose "${COMPOSE_FILES[@]}" "$@"
}

log() {
  printf "\n== %s ==\n" "$1"
}

warn() {
  printf "\n[warning] %s\n" "$1"
}

fail() {
  printf "\n[error] %s\n" "$1" >&2
  exit 1
}

require_command() {
  local command_name="$1"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    fail "Missing required command: $command_name"
  fi
}

version_major() {
  local raw="$1"
  raw="${raw#v}"
  printf "%s" "${raw%%.*}"
}

check_node_version() {
  local node_version
  node_version="$(node --version)"
  local major
  major="$(version_major "$node_version")"

  if [[ "$major" -lt 20 ]]; then
    fail "Node.js 20+ is required. Current version: $node_version"
  fi
}

check_go_version() {
  local go_version
  go_version="$(go version | awk '{print $3}')"
  local clean="${go_version#go}"
  local major="${clean%%.*}"
  local rest="${clean#*.}"
  local minor="${rest%%.*}"

  if [[ "$major" -lt 1 ]] || { [[ "$major" -eq 1 ]] && [[ "$minor" -lt 23 ]]; }; then
    fail "Go 1.23+ is required. Current version: $go_version"
  fi
}

ensure_env_var() {
  local file="$1"
  local key="$2"
  local value="$3"

  if grep -qE "^${key}=" "$file"; then
    if grep -qE "^${key}=$" "$file"; then
      local tmp_file
      tmp_file="$(mktemp)"
      awk -v key="$key" -v value="$value" '
        BEGIN { FS = OFS = "=" }
        $1 == key { print key "=" value; next }
        { print }
      ' "$file" > "$tmp_file"
      mv "$tmp_file" "$file"
    fi
  else
    printf "%s=%s\n" "$key" "$value" >> "$file"
  fi
}

detect_postgres_port() {
  local mapped
  mapped="$(compose port postgres 5432 2>/dev/null || true)"

  if [[ -n "$mapped" ]]; then
    printf "%s" "${mapped##*:}"
    return
  fi

  if [[ -f docker-compose.override.yml ]] && grep -q "15990:5432" docker-compose.override.yml; then
    printf "15990"
    return
  fi

  printf "15432"
}

wait_for_postgres() {
  local attempts=30

  for ((i = 1; i <= attempts; i++)); do
    if compose exec -T postgres pg_isready -U codex -d codex_core >/dev/null 2>&1; then
      return 0
    fi

    sleep 1
  done

  fail "PostgreSQL did not become ready after ${attempts}s."
}

log "Checking required tools"

require_command docker
require_command node
require_command npm

check_node_version

if [[ "$START_API_CONTAINER" != "true" ]]; then
  require_command go
  check_go_version
elif command -v go >/dev/null 2>&1; then
  check_go_version
else
  warn "Go was not found locally. Skipping local backend dependency setup because START_API_CONTAINER=true."
fi

if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  current_branch="$(git rev-parse --abbrev-ref HEAD)"

  if [[ "$current_branch" != "development" ]]; then
    warn "Current branch is '$current_branch'. This setup was written for 'development'. Tiny detail, huge future headache."
  fi
fi

log "Validating Docker Compose configuration"

compose config >/dev/null

log "Starting PostgreSQL"

compose up -d postgres
wait_for_postgres

POSTGRES_HOST_PORT="$(detect_postgres_port)"
DATABASE_URL="postgres://codex:codex@localhost:${POSTGRES_HOST_PORT}/codex_core?sslmode=disable"

log "Preparing backend environment"

if [[ ! -f "$BACKEND_ENV_FILE" ]]; then
  if [[ -f "$ROOT_DIR/backend/.env.example" ]]; then
    cp "$ROOT_DIR/backend/.env.example" "$BACKEND_ENV_FILE"
  else
    touch "$BACKEND_ENV_FILE"
  fi
fi

ensure_env_var "$BACKEND_ENV_FILE" "APP_ENV" "development"
ensure_env_var "$BACKEND_ENV_FILE" "HTTP_ADDR" ":8080"
ensure_env_var "$BACKEND_ENV_FILE" "FRONTEND_ORIGIN" "$FRONTEND_ORIGIN"
ensure_env_var "$BACKEND_ENV_FILE" "DATABASE_URL" "$DATABASE_URL"
ensure_env_var "$BACKEND_ENV_FILE" "MIGRATIONS_DIR" "internal/adapters/postgres/migrations"
ensure_env_var "$BACKEND_ENV_FILE" "RUN_MIGRATIONS" "true"
ensure_env_var "$BACKEND_ENV_FILE" "AUTH_TOKEN_SECRET" "codex-core-local-development-token-secret-change-before-production"
ensure_env_var "$BACKEND_ENV_FILE" "AUTH_SESSION_TTL" "24h"
ensure_env_var "$BACKEND_ENV_FILE" "AUTH_COOKIE_NAME" "codex_session"
ensure_env_var "$BACKEND_ENV_FILE" "CSRF_COOKIE_NAME" "XSRF-TOKEN"
ensure_env_var "$BACKEND_ENV_FILE" "AUTH_COOKIE_SECURE" "false"
ensure_env_var "$BACKEND_ENV_FILE" "AUTH_COOKIE_SAMESITE" "lax"

log "Installing backend dependencies"

if command -v go >/dev/null 2>&1; then
  (
    cd backend
    go mod download
  )

  if [[ "$INSTALL_GO_TOOLS" == "true" ]]; then
    (
      cd backend
      go install github.com/pressly/goose/v3/cmd/goose@latest
      go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
    )
  fi

  if [[ "$RUN_CHECKS" == "true" ]]; then
    (
      cd backend
      go test ./...
      go vet ./...
    )
  fi
fi

log "Preparing frontend environment"

if [[ ! -f "$FRONTEND_ENV_FILE" && ! -f "$ROOT_DIR/frontend/.env" ]]; then
  cat > "$FRONTEND_ENV_FILE" <<EOF
VITE_API_URL=${API_URL}
EOF
else
  warn "Frontend env already exists. Preserving existing frontend .env/.env.local."
fi

log "Installing frontend dependencies"

(
  cd frontend

  if [[ -f package-lock.json ]]; then
    npm ci
  else
    npm install
  fi

  if [[ "$RUN_CHECKS" == "true" ]]; then
    npm run build
  fi
)

if [[ "$START_API_CONTAINER" == "true" ]]; then
  log "Building and starting API container"
  compose up -d --build api
fi

log "Setup completed"

cat <<EOF

PostgreSQL is running through Docker Compose.
Detected local PostgreSQL port: ${POSTGRES_HOST_PORT}

Backend env:
  ${BACKEND_ENV_FILE}

Frontend env:
  ${FRONTEND_ENV_FILE}

Run the app locally with:

  cd backend
  go run ./cmd/api

  cd frontend
  npm run dev

Or run the API through Docker with:

  START_API_CONTAINER=true ./setup.sh

Useful health checks:

  curl http://localhost:8080/health
  curl http://localhost:8080/ready

EOF