package postgres

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
)

func (s *Store) ListNodesJSON(ctx context.Context, projectID, typeID, typeSlug, search string) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `
		SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) FROM (
			SELECT n.id, n.project_id AS "projectId", n.type_id AS "typeId", n.title, n.content, n.properties, n.created_at AS "createdAt", n.updated_at AS "updatedAt",
			json_build_object('id',nt.id,'projectId',nt.project_id,'name',nt.name,'slug',nt.slug,'description',nt.description,'color',nt.color,'icon',nt.icon,'fields',nt.fields,'createdAt',nt.created_at,'updatedAt',nt.updated_at) AS type
			FROM nodes n JOIN node_types nt ON nt.id=n.type_id
			WHERE n.project_id=$1 AND ($2='' OR n.type_id::text=$2) AND ($3='' OR nt.slug=$3) AND ($4='' OR n.title ILIKE '%'||$4||'%' OR COALESCE(n.content,'') ILIKE '%'||$4||'%')
			ORDER BY n.updated_at DESC
		) t
	`, projectID, typeID, slug(typeSlug), strings.TrimSpace(search))
}

func (s *Store) GetNodeJSON(ctx context.Context, id string) (json.RawMessage, error) {
	return s.nodeJSON(ctx, `n.id=$1`, id)
}

func (s *Store) nodeJSON(ctx context.Context, where string, args ...any) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, fmt.Sprintf(`SELECT row_to_json(t) FROM (SELECT n.id, n.project_id AS "projectId", n.type_id AS "typeId", n.title, n.content, n.properties, n.created_at AS "createdAt", n.updated_at AS "updatedAt", json_build_object('id',nt.id,'projectId',nt.project_id,'name',nt.name,'slug',nt.slug,'description',nt.description,'color',nt.color,'icon',nt.icon,'fields',nt.fields,'createdAt',nt.created_at,'updatedAt',nt.updated_at) AS type FROM nodes n JOIN node_types nt ON nt.id=n.type_id WHERE %s) t`, where), args...)
}

func (s *Store) CreateNodeJSON(ctx context.Context, projectID string, p NodePayload) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `WITH inserted AS (INSERT INTO nodes (project_id,type_id,title,content,properties) SELECT $1, nt.id, $3, $4, $5 FROM node_types nt WHERE nt.id=$2 AND nt.project_id=$1 RETURNING id, project_id AS "projectId", type_id AS "typeId", title, content, properties, created_at AS "createdAt", updated_at AS "updatedAt") SELECT row_to_json(inserted) FROM inserted`, projectID, p.TypeID, strings.TrimSpace(p.Title), nullableString(p.Content), jsonDefault(p.Properties, "{}"))
}

func (s *Store) UpdateNodeJSON(ctx context.Context, id string, p NodePayload) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `WITH updated AS (UPDATE nodes SET type_id=COALESCE(NULLIF($2,'')::uuid,type_id), title=COALESCE(NULLIF($3,''),title), content=$4, properties=COALESCE($5,properties) WHERE id=$1 RETURNING id, project_id AS "projectId", type_id AS "typeId", title, content, properties, created_at AS "createdAt", updated_at AS "updatedAt") SELECT row_to_json(updated) FROM updated`, id, p.TypeID, strings.TrimSpace(p.Title), nullableString(p.Content), jsonOptional(p.Properties))
}

func (s *Store) ListEdgesJSON(ctx context.Context, projectID string) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) FROM (SELECT e.id, e.project_id AS "projectId", e.source_node_id AS "sourceNodeId", e.target_node_id AS "targetNodeId", e.type_id AS "typeId", e.properties, e.created_at AS "createdAt", e.updated_at AS "updatedAt", json_build_object('id',et.id,'projectId',et.project_id,'name',et.name,'slug',et.slug,'description',et.description,'directed',et.directed,'color',et.color,'strokeStyle',et.stroke_style,'fields',et.fields,'createdAt',et.created_at,'updatedAt',et.updated_at) AS type FROM edges e JOIN edge_types et ON et.id=e.type_id WHERE e.project_id=$1 ORDER BY e.created_at) t`, projectID)
}

func (s *Store) CreateEdgeJSON(ctx context.Context, projectID string, p EdgePayload) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `WITH inserted AS (INSERT INTO edges (project_id,source_node_id,target_node_id,type_id,properties) SELECT $1, sn.id, tn.id, et.id, $5 FROM nodes sn JOIN nodes tn ON tn.id=$3 AND tn.project_id=$1 JOIN edge_types et ON et.id=$4 AND et.project_id=$1 WHERE sn.id=$2 AND sn.project_id=$1 RETURNING id, project_id AS "projectId", source_node_id AS "sourceNodeId", target_node_id AS "targetNodeId", type_id AS "typeId", properties, created_at AS "createdAt", updated_at AS "updatedAt") SELECT row_to_json(inserted) FROM inserted`, projectID, p.SourceNodeID, p.TargetNodeID, p.TypeID, jsonDefault(p.Properties, "{}"))
}

func (s *Store) UpdateEdgeJSON(ctx context.Context, id string, p EdgePayload) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `WITH updated AS (UPDATE edges SET source_node_id=COALESCE(NULLIF($2,'')::uuid,source_node_id), target_node_id=COALESCE(NULLIF($3,'')::uuid,target_node_id), type_id=COALESCE(NULLIF($4,'')::uuid,type_id), properties=COALESCE($5,properties) WHERE id=$1 RETURNING id, project_id AS "projectId", source_node_id AS "sourceNodeId", target_node_id AS "targetNodeId", type_id AS "typeId", properties, created_at AS "createdAt", updated_at AS "updatedAt") SELECT row_to_json(updated) FROM updated`, id, p.SourceNodeID, p.TargetNodeID, p.TypeID, jsonOptional(p.Properties))
}

func (s *Store) GraphJSON(ctx context.Context, projectID string) (json.RawMessage, error) {
	nodes, err := s.ListNodesJSON(ctx, projectID, "", "", "")
	if err != nil {
		return nil, err
	}
	edges, err := s.ListEdgesJSON(ctx, projectID)
	if err != nil {
		return nil, err
	}
	return json.Marshal(map[string]json.RawMessage{"nodes": nodes, "edges": edges})
}
