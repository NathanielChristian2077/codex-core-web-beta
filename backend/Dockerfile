FROM golang:1.23-alpine AS build

WORKDIR /app

COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/codex-api ./cmd/api

FROM alpine:3.21

RUN adduser -D -H -u 10001 codex
WORKDIR /app

COPY --from=build /out/codex-api /app/codex-api
COPY internal/adapters/postgres/migrations /app/internal/adapters/postgres/migrations

USER codex
EXPOSE 8080

ENTRYPOINT ["/app/codex-api"]
