package postgres

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
)

type MembershipPayload struct {
	Email string `json:"email"`
	Role  string `json:"role"`
}

func (s *Store) UserCanManageProjectMembers(ctx context.Context, userID, projectID string) (bool, error) {
	var ok bool
	err := s.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM memberships WHERE project_id=$1 AND user_id=$2 AND role='owner')`, projectID, userID).Scan(&ok)
	return ok, err
}

func (s *Store) ListMembersJSON(ctx context.Context, projectID string) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `
		SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) FROM (
			SELECT m.id, m.project_id AS "projectId", m.user_id AS "userId", m.role, m.created_at AS "createdAt", m.updated_at AS "updatedAt",
			json_build_object('id', u.id, 'name', u.name, 'email', u.email) AS "user"
			FROM memberships m JOIN users u ON u.id=m.user_id
			WHERE m.project_id=$1
			ORDER BY CASE m.role WHEN 'owner' THEN 0 WHEN 'editor' THEN 1 ELSE 2 END, u.email
		) t
	`, projectID)
}

func (s *Store) AddMemberJSON(ctx context.Context, projectID string, payload MembershipPayload) (json.RawMessage, error) {
	role, err := normalizeMembershipRole(payload.Role)
	if err != nil {
		return nil, err
	}
	return queryJSON(ctx, s.pool, `
		WITH target_user AS (
			SELECT id FROM users WHERE email=$2
		), upserted AS (
			INSERT INTO memberships (project_id, user_id, role)
			SELECT $1, id, $3 FROM target_user
			ON CONFLICT (project_id, user_id) DO UPDATE SET role=EXCLUDED.role
			WHERE memberships.role <> 'owner'
			RETURNING id, project_id, user_id, role, created_at, updated_at
		)
		SELECT row_to_json(t) FROM (
			SELECT m.id, m.project_id AS "projectId", m.user_id AS "userId", m.role, m.created_at AS "createdAt", m.updated_at AS "updatedAt",
			json_build_object('id', u.id, 'name', u.name, 'email', u.email) AS "user"
			FROM upserted m JOIN users u ON u.id=m.user_id
		) t
	`, projectID, strings.ToLower(strings.TrimSpace(payload.Email)), role)
}

func (s *Store) UpdateMemberRoleJSON(ctx context.Context, projectID, memberUserID string, role string) (json.RawMessage, error) {
	normalizedRole, err := normalizeMembershipRole(role)
	if err != nil {
		return nil, err
	}
	return queryJSON(ctx, s.pool, `
		WITH updated AS (
			UPDATE memberships SET role=$3
			WHERE project_id=$1 AND user_id=$2 AND role <> 'owner'
			RETURNING id, project_id, user_id, role, created_at, updated_at
		)
		SELECT row_to_json(t) FROM (
			SELECT m.id, m.project_id AS "projectId", m.user_id AS "userId", m.role, m.created_at AS "createdAt", m.updated_at AS "updatedAt",
			json_build_object('id', u.id, 'name', u.name, 'email', u.email) AS "user"
			FROM updated m JOIN users u ON u.id=m.user_id
		) t
	`, projectID, memberUserID, normalizedRole)
}

func (s *Store) RemoveMember(ctx context.Context, projectID, memberUserID string) error {
	cmd, err := s.pool.Exec(ctx, `DELETE FROM memberships WHERE project_id=$1 AND user_id=$2 AND role <> 'owner'`, projectID, memberUserID)
	return affectedOrErr(cmd.RowsAffected(), err)
}

func normalizeMembershipRole(role string) (string, error) {
	role = strings.ToLower(strings.TrimSpace(role))
	if role == "" {
		return "viewer", nil
	}
	switch role {
	case "editor", "viewer":
		return role, nil
	case "owner":
		return "", fmt.Errorf("owner role cannot be assigned through membership endpoints")
	default:
		return "", fmt.Errorf("invalid membership role: %s", role)
	}
}
