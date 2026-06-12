package postgres

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
)

func (s *Store) ListNodeTypesJSON(ctx context.Context, projectID string) (json.RawMessage, error) {
	return s.listTypes(ctx, "node_types", projectID)
}
func (s *Store) ListEdgeTypesJSON(ctx context.Context, projectID string) (json.RawMessage, error) {
	return s.listTypes(ctx, "edge_types", projectID)
}

func (s *Store) listTypes(ctx context.Context, table, projectID string) (json.RawMessage, error) {
	selects := `id, project_id AS "projectId", name, slug, description, color, fields, created_at AS "createdAt", updated_at AS "updatedAt"`
	if table == "node_types" {
		selects = `id, project_id AS "projectId", name, slug, description, color, icon, fields, created_at AS "createdAt", updated_at AS "updatedAt"`
	}
	if table == "edge_types" {
		selects = `id, project_id AS "projectId", name, slug, description, directed, color, stroke_style AS "strokeStyle", fields, created_at AS "createdAt", updated_at AS "updatedAt"`
	}
	return queryJSON(ctx, s.pool, fmt.Sprintf(`SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) FROM (SELECT %s FROM %s WHERE project_id=$1 ORDER BY name) t`, selects, table), projectID)
}

func (s *Store) CreateNodeTypeJSON(ctx context.Context, projectID string, p TypePayload) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `WITH inserted AS (INSERT INTO node_types (project_id,name,slug,description,color,icon,fields) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, project_id AS "projectId", name, slug, description, color, icon, fields, created_at AS "createdAt", updated_at AS "updatedAt") SELECT row_to_json(inserted) FROM inserted`, projectID, strings.TrimSpace(p.Name), slug(p.Slug), nullableString(p.Description), nullableString(p.Color), nullableString(p.Icon), jsonDefault(p.Fields, "[]"))
}

func (s *Store) CreateEdgeTypeJSON(ctx context.Context, projectID string, p TypePayload) (json.RawMessage, error) {
	directed := true
	if p.Directed != nil {
		directed = *p.Directed
	}
	return queryJSON(ctx, s.pool, `WITH inserted AS (INSERT INTO edge_types (project_id,name,slug,description,directed,color,stroke_style,fields) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, project_id AS "projectId", name, slug, description, directed, color, stroke_style AS "strokeStyle", fields, created_at AS "createdAt", updated_at AS "updatedAt") SELECT row_to_json(inserted) FROM inserted`, projectID, strings.TrimSpace(p.Name), slug(p.Slug), nullableString(p.Description), directed, nullableString(p.Color), nullableString(p.StrokeStyle), jsonDefault(p.Fields, "[]"))
}

func (s *Store) UpdateNodeTypeJSON(ctx context.Context, id string, p TypePayload) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `WITH updated AS (UPDATE node_types SET name=COALESCE(NULLIF($2,''),name), slug=COALESCE(NULLIF($3,''),slug), description=$4, color=$5, icon=$6, fields=COALESCE($7,fields) WHERE id=$1 RETURNING id, project_id AS "projectId", name, slug, description, color, icon, fields, created_at AS "createdAt", updated_at AS "updatedAt") SELECT row_to_json(updated) FROM updated`, id, strings.TrimSpace(p.Name), slug(p.Slug), nullableString(p.Description), nullableString(p.Color), nullableString(p.Icon), jsonOptional(p.Fields))
}

func (s *Store) UpdateEdgeTypeJSON(ctx context.Context, id string, p TypePayload) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `WITH updated AS (UPDATE edge_types SET name=COALESCE(NULLIF($2,''),name), slug=COALESCE(NULLIF($3,''),slug), description=$4, directed=COALESCE($5,directed), color=$6, stroke_style=$7, fields=COALESCE($8,fields) WHERE id=$1 RETURNING id, project_id AS "projectId", name, slug, description, directed, color, stroke_style AS "strokeStyle", fields, created_at AS "createdAt", updated_at AS "updatedAt") SELECT row_to_json(updated) FROM updated`, id, strings.TrimSpace(p.Name), slug(p.Slug), nullableString(p.Description), p.Directed, nullableString(p.Color), nullableString(p.StrokeStyle), jsonOptional(p.Fields))
}

func (s *Store) DeleteByKind(ctx context.Context, kind, id string) error {
	tables := map[string]string{"nodeType": "node_types", "edgeType": "edge_types", "node": "nodes", "edge": "edges", "view": "views"}
	table, ok := tables[kind]
	if !ok {
		return ErrNotFound
	}
	cmd, err := s.pool.Exec(ctx, fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, table), id)
	return affectedOrErr(cmd.RowsAffected(), err)
}
