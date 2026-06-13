package postgres

import (
	"context"
	"encoding/json"
	"strings"
)

func (s *Store) ListProjectsJSON(ctx context.Context, userID string) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `
		SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) FROM (
			SELECT p.id, p.owner_id AS "ownerId", p.name, p.description, p.image_url AS "imageUrl", p.created_at AS "createdAt", p.updated_at AS "updatedAt"
			FROM projects p JOIN memberships m ON m.project_id=p.id
			WHERE m.user_id=$1 ORDER BY p.updated_at DESC
		) t
	`, userID)
}

func (s *Store) CreateProjectJSON(ctx context.Context, ownerID string, p ProjectPayload) (json.RawMessage, error) {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() { _ = tx.Rollback(ctx) }()
	rawProject, err := queryJSONTx(ctx, tx, `
		WITH inserted AS (
			INSERT INTO projects (owner_id, name, description, image_url)
			VALUES ($1,$2,$3,$4)
			RETURNING id, owner_id AS "ownerId", name, description, image_url AS "imageUrl", created_at AS "createdAt", updated_at AS "updatedAt"
		) SELECT row_to_json(inserted) FROM inserted
	`, ownerID, strings.TrimSpace(p.Name), nullableString(p.Description), nullableString(p.ImageURL))
	if err != nil {
		return nil, err
	}
	var projectInfo struct {
		ID string `json:"id"`
	}
	if err := json.Unmarshal(rawProject, &projectInfo); err != nil {
		return nil, err
	}
	_, err = tx.Exec(ctx, `INSERT INTO memberships (project_id,user_id,role) VALUES ($1,$2,'owner')`, projectInfo.ID, ownerID)
	if err != nil {
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	if p.PresetSlug != nil {
		_ = s.ApplyPreset(ctx, projectInfo.ID, *p.PresetSlug)
	}
	return rawProject, nil
}

func (s *Store) GetProjectJSON(ctx context.Context, userID, projectID string) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `
		SELECT row_to_json(t) FROM (
			SELECT p.id, p.owner_id AS "ownerId", p.name, p.description, p.image_url AS "imageUrl", p.created_at AS "createdAt", p.updated_at AS "updatedAt"
			FROM projects p JOIN memberships m ON m.project_id=p.id
			WHERE p.id=$1 AND m.user_id=$2
		) t
	`, projectID, userID)
}

func (s *Store) UpdateProjectJSON(ctx context.Context, projectID string, p ProjectPayload) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `
		WITH updated AS (
			UPDATE projects SET name=COALESCE(NULLIF($2,''),name), description=$3, image_url=$4
			WHERE id=$1 RETURNING id, owner_id AS "ownerId", name, description, image_url AS "imageUrl", created_at AS "createdAt", updated_at AS "updatedAt"
		) SELECT row_to_json(updated) FROM updated
	`, projectID, strings.TrimSpace(p.Name), nullableString(p.Description), nullableString(p.ImageURL))
}

func (s *Store) DeleteProject(ctx context.Context, userID, projectID string) error {
	cmd, err := s.pool.Exec(ctx, `DELETE FROM projects WHERE id=$1 AND owner_id=$2`, projectID, userID)
	return affectedOrErr(cmd.RowsAffected(), err)
}
