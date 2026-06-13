package postgres

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
)

func (s *Store) ListViewsJSON(ctx context.Context, projectID string) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) FROM (SELECT id, project_id AS "projectId", name, mode, filters, settings, created_at AS "createdAt", updated_at AS "updatedAt" FROM views WHERE project_id=$1 ORDER BY updated_at DESC) t`, projectID)
}

func (s *Store) CreateViewJSON(ctx context.Context, projectID string, p ViewPayload) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `WITH inserted AS (INSERT INTO views (project_id,name,mode,filters,settings) VALUES ($1,$2,COALESCE(NULLIF($3,''),'graph'),$4,$5) RETURNING id, project_id AS "projectId", name, mode, filters, settings, created_at AS "createdAt", updated_at AS "updatedAt") SELECT row_to_json(inserted) FROM inserted`, projectID, strings.TrimSpace(p.Name), p.Mode, jsonDefault(p.Filters, "{}"), jsonDefault(p.Settings, "{}"))
}

func (s *Store) UpdateViewJSON(ctx context.Context, id string, p ViewPayload) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `WITH updated AS (UPDATE views SET name=COALESCE(NULLIF($2,''),name), mode=COALESCE(NULLIF($3,''),mode), filters=COALESCE($4,filters), settings=COALESCE($5,settings) WHERE id=$1 RETURNING id, project_id AS "projectId", name, mode, filters, settings, created_at AS "createdAt", updated_at AS "updatedAt") SELECT row_to_json(updated) FROM updated`, id, strings.TrimSpace(p.Name), p.Mode, jsonOptional(p.Filters), jsonOptional(p.Settings))
}

func (s *Store) ListLayoutsJSON(ctx context.Context, viewID string) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) FROM (SELECT id, project_id AS "projectId", view_id AS "viewId", node_id AS "nodeId", x, y, locked, updated_at AS "updatedAt" FROM layouts WHERE view_id=$1) t`, viewID)
}

func (s *Store) UpsertLayoutJSON(ctx context.Context, projectID, viewID string, p LayoutPayload) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `WITH upserted AS (INSERT INTO layouts (project_id,view_id,node_id,x,y,locked) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (view_id,node_id) DO UPDATE SET x=EXCLUDED.x, y=EXCLUDED.y, locked=EXCLUDED.locked, updated_at=now() RETURNING id, project_id AS "projectId", view_id AS "viewId", node_id AS "nodeId", x, y, locked, updated_at AS "updatedAt") SELECT row_to_json(upserted) FROM upserted`, projectID, viewID, p.NodeID, p.X, p.Y, p.Locked)
}

func (s *Store) ApplyPreset(ctx context.Context, projectID, presetSlug string) error {
	switch slug(presetSlug) {
	case "", "blank":
		return nil
	case "rpg", "rpg-campaign", "campaign":
		return s.applyRPGPreset(ctx, projectID)
	default:
		return fmt.Errorf("unknown preset: %s", presetSlug)
	}
}

func (s *Store) applyRPGPreset(ctx context.Context, projectID string) error {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback(ctx) }()
	nodeTypes := []struct{ name, slug, color, icon string }{{"Event", "event", "#7c3aed", "calendar"}, {"Character", "character", "#2563eb", "user"}, {"Location", "location", "#16a34a", "map-pin"}, {"Object", "object", "#d97706", "package"}, {"Faction", "faction", "#dc2626", "flag"}}
	for _, nt := range nodeTypes {
		if _, err := tx.Exec(ctx, `INSERT INTO node_types (project_id,name,slug,color,icon,fields) VALUES ($1,$2,$3,$4,$5,'[]'::jsonb) ON CONFLICT (project_id,slug) DO NOTHING`, projectID, nt.name, nt.slug, nt.color, nt.icon); err != nil {
			return err
		}
	}
	edgeTypes := []struct {
		name, slug, color string
		directed          bool
	}{{"Involves", "involves", "#8b5cf6", true}, {"Happens at", "happens_at", "#22c55e", true}, {"Owns", "owns", "#f59e0b", true}, {"Belongs to", "belongs_to", "#ef4444", true}, {"Opposes", "opposes", "#b91c1c", false}, {"Causes", "causes", "#6366f1", true}}
	for _, et := range edgeTypes {
		if _, err := tx.Exec(ctx, `INSERT INTO edge_types (project_id,name,slug,directed,color,fields) VALUES ($1,$2,$3,$4,$5,'[]'::jsonb) ON CONFLICT (project_id,slug) DO NOTHING`, projectID, et.name, et.slug, et.directed, et.color); err != nil {
			return err
		}
	}
	_, err = tx.Exec(ctx, `INSERT INTO views (project_id,name,mode,filters,settings) VALUES ($1,'Default graph','graph','{}'::jsonb,'{}'::jsonb)`, projectID)
	if err != nil {
		return err
	}
	return tx.Commit(ctx)
}
