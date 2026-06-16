package postgres

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

type ProjectTransferPayload struct {
	Name      *string              `json:"name"`
	Project   transferProject      `json:"project"`
	NodeTypes []transferNodeType   `json:"nodeTypes"`
	EdgeTypes []transferEdgeType   `json:"edgeTypes"`
	Nodes     []transferNode       `json:"nodes"`
	Edges     []transferEdge       `json:"edges"`
	Views     []transferView       `json:"views"`
	Layouts   []transferLayout     `json:"layouts"`
}

type transferProject struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description *string `json:"description"`
	ImageURL    *string `json:"imageUrl"`
}

type transferNodeType struct {
	ID          string          `json:"id"`
	Name        string          `json:"name"`
	Slug        string          `json:"slug"`
	Description *string         `json:"description"`
	Color       *string         `json:"color"`
	Icon        *string         `json:"icon"`
	Fields      json.RawMessage `json:"fields"`
}

type transferEdgeType struct {
	ID          string          `json:"id"`
	Name        string          `json:"name"`
	Slug        string          `json:"slug"`
	Description *string         `json:"description"`
	Directed    bool            `json:"directed"`
	Color       *string         `json:"color"`
	StrokeStyle *string         `json:"strokeStyle"`
	Fields      json.RawMessage `json:"fields"`
}

type transferNode struct {
	ID         string          `json:"id"`
	TypeID     string          `json:"typeId"`
	Title      string          `json:"title"`
	Content    *string         `json:"content"`
	Properties json.RawMessage `json:"properties"`
}

type transferEdge struct {
	ID           string          `json:"id"`
	SourceNodeID string          `json:"sourceNodeId"`
	TargetNodeID string          `json:"targetNodeId"`
	TypeID       string          `json:"typeId"`
	Properties   json.RawMessage `json:"properties"`
}

type transferView struct {
	ID       string          `json:"id"`
	Name     string          `json:"name"`
	Mode     string          `json:"mode"`
	Filters  json.RawMessage `json:"filters"`
	Settings json.RawMessage `json:"settings"`
}

type transferLayout struct {
	ViewID string  `json:"viewId"`
	NodeID string  `json:"nodeId"`
	X      float64 `json:"x"`
	Y      float64 `json:"y"`
	Locked bool    `json:"locked"`
}

func (s *Store) ExportProjectJSON(ctx context.Context, projectID string) (json.RawMessage, error) {
	return queryJSON(ctx, s.pool, `
		SELECT json_build_object(
			'version', 1,
			'exportedAt', now(),
			'project', json_build_object(
				'id', p.id,
				'name', p.name,
				'description', p.description,
				'imageUrl', p.image_url
			),
			'nodeTypes', COALESCE((
				SELECT json_agg(json_build_object(
					'id', nt.id,
					'name', nt.name,
					'slug', nt.slug,
					'description', nt.description,
					'color', nt.color,
					'icon', nt.icon,
					'fields', nt.fields
				) ORDER BY nt.created_at)
				FROM node_types nt WHERE nt.project_id = p.id
			), '[]'::json),
			'edgeTypes', COALESCE((
				SELECT json_agg(json_build_object(
					'id', et.id,
					'name', et.name,
					'slug', et.slug,
					'description', et.description,
					'directed', et.directed,
					'color', et.color,
					'strokeStyle', et.stroke_style,
					'fields', et.fields
				) ORDER BY et.created_at)
				FROM edge_types et WHERE et.project_id = p.id
			), '[]'::json),
			'nodes', COALESCE((
				SELECT json_agg(json_build_object(
					'id', n.id,
					'typeId', n.type_id,
					'title', n.title,
					'content', n.content,
					'properties', n.properties
				) ORDER BY n.created_at)
				FROM nodes n WHERE n.project_id = p.id
			), '[]'::json),
			'edges', COALESCE((
				SELECT json_agg(json_build_object(
					'id', e.id,
					'sourceNodeId', e.source_node_id,
					'targetNodeId', e.target_node_id,
					'typeId', e.type_id,
					'properties', e.properties
				) ORDER BY e.created_at)
				FROM edges e WHERE e.project_id = p.id
			), '[]'::json),
			'views', COALESCE((
				SELECT json_agg(json_build_object(
					'id', v.id,
					'name', v.name,
					'mode', v.mode,
					'filters', v.filters,
					'settings', v.settings
				) ORDER BY v.created_at)
				FROM views v WHERE v.project_id = p.id
			), '[]'::json),
			'layouts', COALESCE((
				SELECT json_agg(json_build_object(
					'viewId', l.view_id,
					'nodeId', l.node_id,
					'x', l.x,
					'y', l.y,
					'locked', l.locked
				) ORDER BY l.updated_at)
				FROM layouts l WHERE l.project_id = p.id
			), '[]'::json)
		)
		FROM projects p WHERE p.id = $1
	`, projectID)
}

func (s *Store) DuplicateProjectJSON(ctx context.Context, ownerID, sourceProjectID string, nameOverride *string) (json.RawMessage, error) {
	exported, err := s.ExportProjectJSON(ctx, sourceProjectID)
	if err != nil {
		return nil, err
	}

	var payload ProjectTransferPayload
	if err := json.Unmarshal(exported, &payload); err != nil {
		return nil, fmt.Errorf("decode project export: %w", err)
	}

	copyName := strings.TrimSpace(payload.Project.Name)
	if copyName == "" {
		copyName = "Imported project"
	}
	copyName += " Copy"
	payload.Name = &copyName
	if nameOverride != nil && strings.TrimSpace(*nameOverride) != "" {
		payload.Name = nameOverride
	}

	return s.ImportProjectJSON(ctx, ownerID, payload)
}

func (s *Store) ImportProjectJSON(ctx context.Context, ownerID string, payload ProjectTransferPayload) (json.RawMessage, error) {
	projectName := strings.TrimSpace(payload.Project.Name)
	if payload.Name != nil && strings.TrimSpace(*payload.Name) != "" {
		projectName = strings.TrimSpace(*payload.Name)
	}
	if projectName == "" {
		projectName = "Imported project"
	}

	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer func() { _ = tx.Rollback(ctx) }()

	var projectID string
	var createdProject json.RawMessage
	if err := tx.QueryRow(ctx, `
		INSERT INTO projects (owner_id, name, description, image_url)
		VALUES ($1, $2, $3, $4)
		RETURNING id, row_to_json((SELECT t FROM (SELECT id, owner_id AS "ownerId", name, description, image_url AS "imageUrl", created_at AS "createdAt", updated_at AS "updatedAt") t))
	`, ownerID, projectName, nullableString(payload.Project.Description), nullableString(payload.Project.ImageURL)).Scan(&projectID, &createdProject); err != nil {
		return nil, err
	}

	if _, err := tx.Exec(ctx, `INSERT INTO memberships (project_id, user_id, role) VALUES ($1, $2, 'owner')`, projectID, ownerID); err != nil {
		return nil, err
	}

	nodeTypeIDs := make(map[string]string, len(payload.NodeTypes))
	for _, item := range payload.NodeTypes {
		if strings.TrimSpace(item.Name) == "" || strings.TrimSpace(item.Slug) == "" {
			return nil, fmt.Errorf("node type name and slug are required")
		}
		var newID string
		if err := tx.QueryRow(ctx, `
			INSERT INTO node_types (project_id, name, slug, description, color, icon, fields)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id
		`, projectID, strings.TrimSpace(item.Name), slug(item.Slug), nullableString(item.Description), nullableString(item.Color), nullableString(item.Icon), jsonDefault(item.Fields, "[]")).Scan(&newID); err != nil {
			return nil, err
		}
		nodeTypeIDs[item.ID] = newID
	}

	edgeTypeIDs := make(map[string]string, len(payload.EdgeTypes))
	for _, item := range payload.EdgeTypes {
		if strings.TrimSpace(item.Name) == "" || strings.TrimSpace(item.Slug) == "" {
			return nil, fmt.Errorf("edge type name and slug are required")
		}
		var newID string
		if err := tx.QueryRow(ctx, `
			INSERT INTO edge_types (project_id, name, slug, description, directed, color, stroke_style, fields)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING id
		`, projectID, strings.TrimSpace(item.Name), slug(item.Slug), nullableString(item.Description), item.Directed, nullableString(item.Color), nullableString(item.StrokeStyle), jsonDefault(item.Fields, "[]")).Scan(&newID); err != nil {
			return nil, err
		}
		edgeTypeIDs[item.ID] = newID
	}

	nodeIDs := make(map[string]string, len(payload.Nodes))
	for _, item := range payload.Nodes {
		newTypeID, ok := nodeTypeIDs[item.TypeID]
		if !ok {
			return nil, fmt.Errorf("node references unknown type id: %s", item.TypeID)
		}
		if strings.TrimSpace(item.Title) == "" {
			return nil, fmt.Errorf("node title is required")
		}
		var newID string
		if err := tx.QueryRow(ctx, `
			INSERT INTO nodes (project_id, type_id, title, content, properties)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id
		`, projectID, newTypeID, strings.TrimSpace(item.Title), nullableString(item.Content), jsonDefault(item.Properties, "{}")).Scan(&newID); err != nil {
			return nil, err
		}
		nodeIDs[item.ID] = newID
	}

	for _, item := range payload.Edges {
		newSourceID, ok := nodeIDs[item.SourceNodeID]
		if !ok {
			return nil, fmt.Errorf("edge references unknown source node id: %s", item.SourceNodeID)
		}
		newTargetID, ok := nodeIDs[item.TargetNodeID]
		if !ok {
			return nil, fmt.Errorf("edge references unknown target node id: %s", item.TargetNodeID)
		}
		newTypeID, ok := edgeTypeIDs[item.TypeID]
		if !ok {
			return nil, fmt.Errorf("edge references unknown type id: %s", item.TypeID)
		}
		if _, err := tx.Exec(ctx, `
			INSERT INTO edges (project_id, source_node_id, target_node_id, type_id, properties)
			VALUES ($1, $2, $3, $4, $5)
		`, projectID, newSourceID, newTargetID, newTypeID, jsonDefault(item.Properties, "{}")); err != nil {
			return nil, err
		}
	}

	viewIDs := make(map[string]string, len(payload.Views))
	for _, item := range payload.Views {
		name := strings.TrimSpace(item.Name)
		if name == "" {
			name = "Imported view"
		}
		mode := strings.TrimSpace(item.Mode)
		if mode == "" {
			mode = "graph"
		}
		var newID string
		if err := tx.QueryRow(ctx, `
			INSERT INTO views (project_id, name, mode, filters, settings)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id
		`, projectID, name, mode, jsonDefault(item.Filters, "{}"), jsonDefault(item.Settings, "{}")).Scan(&newID); err != nil {
			return nil, err
		}
		viewIDs[item.ID] = newID
	}

	for _, item := range payload.Layouts {
		newViewID, ok := viewIDs[item.ViewID]
		if !ok {
			continue
		}
		newNodeID, ok := nodeIDs[item.NodeID]
		if !ok {
			continue
		}
		if _, err := tx.Exec(ctx, `
			INSERT INTO layouts (project_id, view_id, node_id, x, y, locked)
			VALUES ($1, $2, $3, $4, $5, $6)
			ON CONFLICT (view_id, node_id) DO UPDATE SET x = EXCLUDED.x, y = EXCLUDED.y, locked = EXCLUDED.locked, updated_at = $7
		`, projectID, newViewID, newNodeID, item.X, item.Y, item.Locked, time.Now().UTC()); err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return createdProject, nil
}
