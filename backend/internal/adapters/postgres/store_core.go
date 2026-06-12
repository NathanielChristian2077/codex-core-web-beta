package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrNotFound = errors.New("not found")

type Store struct{ pool *pgxpool.Pool }

func NewStore(pool *pgxpool.Pool) *Store { return &Store{pool: pool} }

type User struct {
	ID        string    `json:"id"`
	Name      *string   `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	Role      *string   `json:"role,omitempty"`
	AvatarURL *string   `json:"avatarUrl,omitempty"`
}

type ProjectPayload struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
	ImageURL    *string `json:"imageUrl"`
	PresetSlug  *string `json:"presetSlug"`
}

type TypePayload struct {
	Name        string          `json:"name"`
	Slug        string          `json:"slug"`
	Description *string         `json:"description"`
	Color       *string         `json:"color"`
	Icon        *string         `json:"icon"`
	StrokeStyle *string         `json:"strokeStyle"`
	Directed    *bool           `json:"directed"`
	Fields      json.RawMessage `json:"fields"`
}

type NodePayload struct {
	TypeID     string          `json:"typeId"`
	Title      string          `json:"title"`
	Content    *string         `json:"content"`
	Properties json.RawMessage `json:"properties"`
}

type EdgePayload struct {
	SourceNodeID string          `json:"sourceNodeId"`
	TargetNodeID string          `json:"targetNodeId"`
	TypeID       string          `json:"typeId"`
	Properties   json.RawMessage `json:"properties"`
}

type ViewPayload struct {
	Name     string          `json:"name"`
	Mode     string          `json:"mode"`
	Filters  json.RawMessage `json:"filters"`
	Settings json.RawMessage `json:"settings"`
}

type LayoutPayload struct {
	NodeID string  `json:"nodeId"`
	X      float64 `json:"x"`
	Y      float64 `json:"y"`
	Locked bool    `json:"locked"`
}

func (s *Store) CreateUser(ctx context.Context, name *string, email, passwordHash string) (User, error) {
	row := s.pool.QueryRow(ctx, `
		INSERT INTO users (name, email, password_hash)
		VALUES ($1, $2, $3)
		RETURNING id, name, email, created_at, updated_at
	`, nullableString(name), strings.ToLower(strings.TrimSpace(email)), passwordHash)
	return scanUser(row)
}

func (s *Store) FindUserByEmail(ctx context.Context, email string) (User, string, error) {
	var user User
	var name sql.NullString
	var passwordHash string
	err := s.pool.QueryRow(ctx, `
		SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE email = $1
	`, strings.ToLower(strings.TrimSpace(email))).Scan(&user.ID, &name, &user.Email, &passwordHash, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return User{}, "", normalizeErr(err)
	}
	user.Name = optionalString(name)
	role := "user"
	user.Role = &role
	return user, passwordHash, nil
}

func (s *Store) FindUserByID(ctx context.Context, id string) (User, error) {
	user, err := scanUser(s.pool.QueryRow(ctx, `SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1`, id))
	if err != nil {
		return User{}, err
	}
	role := "user"
	user.Role = &role
	return user, nil
}

func (s *Store) UpdateUser(ctx context.Context, id string, name, email *string) (User, error) {
	user, err := scanUser(s.pool.QueryRow(ctx, `
		UPDATE users SET name = COALESCE($2, name), email = COALESCE(NULLIF($3, ''), email)
		WHERE id = $1 RETURNING id, name, email, created_at, updated_at
	`, id, nullableString(name), nullableEmail(email)))
	if err != nil {
		return User{}, err
	}
	role := "user"
	user.Role = &role
	return user, nil
}

func (s *Store) UpdateUserPassword(ctx context.Context, id, passwordHash string) error {
	cmd, err := s.pool.Exec(ctx, `UPDATE users SET password_hash = $2 WHERE id = $1`, id, passwordHash)
	return affectedOrErr(cmd.RowsAffected(), err)
}

func (s *Store) DeleteUser(ctx context.Context, id string) error {
	cmd, err := s.pool.Exec(ctx, `DELETE FROM users WHERE id = $1`, id)
	return affectedOrErr(cmd.RowsAffected(), err)
}

func (s *Store) UserCanAccessProject(ctx context.Context, userID, projectID string) (bool, error) {
	var ok bool
	err := s.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM memberships WHERE project_id=$1 AND user_id=$2)`, projectID, userID).Scan(&ok)
	return ok, err
}

func (s *Store) UserCanEditProject(ctx context.Context, userID, projectID string) (bool, error) {
	var ok bool
	err := s.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM memberships WHERE project_id=$1 AND user_id=$2 AND role IN ('owner','editor'))`, projectID, userID).Scan(&ok)
	return ok, err
}

func (s *Store) ProjectIDFor(ctx context.Context, kind, id string) (string, error) {
	tables := map[string]string{"nodeType": "node_types", "edgeType": "edge_types", "node": "nodes", "edge": "edges", "view": "views"}
	table, ok := tables[kind]
	if !ok {
		return "", ErrNotFound
	}
	var projectID string
	err := s.pool.QueryRow(ctx, fmt.Sprintf(`SELECT project_id FROM %s WHERE id=$1`, table), id).Scan(&projectID)
	if err != nil {
		return "", normalizeErr(err)
	}
	return projectID, nil
}

type rowScanner interface{ Scan(dest ...any) error }

type txQuerier interface {
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
}

func queryJSON(ctx context.Context, q txQuerier, sql string, args ...any) (json.RawMessage, error) {
	return queryJSONTx(ctx, q, sql, args...)
}
func queryJSONTx(ctx context.Context, q txQuerier, sql string, args ...any) (json.RawMessage, error) {
	var raw []byte
	if err := q.QueryRow(ctx, sql, args...).Scan(&raw); err != nil {
		return nil, normalizeErr(err)
	}
	if len(raw) == 0 {
		return json.RawMessage("null"), nil
	}
	return json.RawMessage(raw), nil
}

func scanUser(row rowScanner) (User, error) {
	var user User
	var name sql.NullString
	if err := row.Scan(&user.ID, &name, &user.Email, &user.CreatedAt, &user.UpdatedAt); err != nil {
		return User{}, normalizeErr(err)
	}
	user.Name = optionalString(name)
	return user, nil
}

func normalizeErr(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrNotFound
	}
	return err
}
func affectedOrErr(rows int64, err error) error {
	if err != nil {
		return err
	}
	if rows == 0 {
		return ErrNotFound
	}
	return nil
}
func optionalString(v sql.NullString) *string {
	if !v.Valid {
		return nil
	}
	return &v.String
}
func nullableString(v *string) any {
	if v == nil {
		return nil
	}
	t := strings.TrimSpace(*v)
	if t == "" {
		return nil
	}
	return t
}
func nullableEmail(v *string) any {
	if v == nil {
		return nil
	}
	t := strings.ToLower(strings.TrimSpace(*v))
	if t == "" {
		return nil
	}
	return t
}
func slug(v string) string {
	v = strings.ToLower(strings.TrimSpace(v))
	v = strings.ReplaceAll(v, " ", "-")
	return strings.ReplaceAll(v, "_", "-")
}
func jsonDefault(v json.RawMessage, fallback string) json.RawMessage {
	if len(v) == 0 || !json.Valid(v) {
		return json.RawMessage(fallback)
	}
	return v
}
func jsonOptional(v json.RawMessage) any {
	if len(v) == 0 || !json.Valid(v) {
		return nil
	}
	return v
}
