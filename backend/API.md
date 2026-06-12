# Codex Core Engine Backend API

This document describes the MVP backend contract for the Go-based Codex Core Engine.

## Authentication

The backend uses cookie-based authentication.

- The authentication cookie is HttpOnly.
- The frontend must send requests with credentials enabled.
- Mutating requests must include `X-CSRF-Token`.
- The CSRF token is exposed through the `XSRF-TOKEN` cookie and can also be refreshed with `GET /auth/csrf`.

### Auth endpoints

```txt
GET    /auth/csrf
POST   /auth/register
POST   /auth/login
GET    /auth/me
PATCH  /auth/me
PATCH  /auth/me/password
DELETE /auth/me
POST   /auth/logout
```

### Register request

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "password123"
}
```

### Login request

```json
{
  "email": "ada@example.com",
  "password": "password123"
}
```

## Projects

```txt
GET    /projects
POST   /projects
GET    /projects/{projectID}
PATCH  /projects/{projectID}
DELETE /projects/{projectID}
POST   /projects/{projectID}/presets
```

### Create project

```json
{
  "name": "Blackspire Campaign",
  "description": "Political fantasy campaign.",
  "imageUrl": null,
  "presetSlug": "rpg-campaign"
}
```

## Memberships

Project owners can manage members.

```txt
GET    /projects/{projectID}/members
POST   /projects/{projectID}/members
PATCH  /projects/{projectID}/members/{userID}
DELETE /projects/{projectID}/members/{userID}
```

### Add member

```json
{
  "email": "player@example.com",
  "role": "editor"
}
```

Supported roles:

```txt
editor
viewer
```

The owner role is created automatically when the project is created and cannot be assigned through the membership endpoints.

## Node Types

```txt
GET    /projects/{projectID}/node-types
POST   /projects/{projectID}/node-types
PATCH  /node-types/{nodeTypeID}
DELETE /node-types/{nodeTypeID}
```

### Create node type

```json
{
  "name": "Character",
  "slug": "character",
  "description": "People, creatures and relevant entities.",
  "color": "#2563eb",
  "icon": "user",
  "fields": []
}
```

## Edge Types

```txt
GET    /projects/{projectID}/edge-types
POST   /projects/{projectID}/edge-types
PATCH  /edge-types/{edgeTypeID}
DELETE /edge-types/{edgeTypeID}
```

### Create edge type

```json
{
  "name": "Involves",
  "slug": "involves",
  "description": "Connects an event to a participating node.",
  "directed": true,
  "color": "#8b5cf6",
  "strokeStyle": "solid",
  "fields": []
}
```

## Nodes

```txt
GET    /projects/{projectID}/nodes
POST   /projects/{projectID}/nodes
GET    /nodes/{nodeID}
PATCH  /nodes/{nodeID}
DELETE /nodes/{nodeID}
```

Supported query filters:

```txt
typeId
typeSlug
search
```

### Create node

```json
{
  "typeId": "node-type-id",
  "title": "Lady Vael",
  "content": "A strategist suspected of influencing the succession.",
  "properties": {
    "imageUrl": null,
    "status": "alive"
  }
}
```

## Edges

```txt
GET    /projects/{projectID}/edges
POST   /projects/{projectID}/edges
PATCH  /edges/{edgeID}
DELETE /edges/{edgeID}
```

### Create edge

```json
{
  "sourceNodeId": "source-node-id",
  "targetNodeId": "target-node-id",
  "typeId": "edge-type-id",
  "properties": {}
}
```

## Graph

```txt
GET /projects/{projectID}/graph
```

Response shape:

```json
{
  "nodes": [],
  "edges": []
}
```

Nodes include their type metadata. Edges include their type metadata.

## Views and Layouts

```txt
GET    /projects/{projectID}/views
POST   /projects/{projectID}/views
PATCH  /views/{viewID}
DELETE /views/{viewID}
GET    /views/{viewID}/layout
PUT    /views/{viewID}/layout/nodes/{nodeID}
```

### Upsert node layout

```json
{
  "nodeId": "node-id",
  "x": 120,
  "y": -80,
  "locked": false
}
```

## WebSocket

```txt
GET /ws/projects/{projectID}
```

Authentication uses the same HttpOnly cookie session.

The connection is authorized through project membership.

Initial event:

```json
{
  "type": "project.sync",
  "payload": {
    "projectId": "project-id",
    "connected": true
  }
}
```

Presence events:

```txt
presence.updated
```

Mutation events are produced by PostgreSQL notifications and broadcast to connected project clients:

```txt
project.updated
project.deleted
node_type.created
node_type.updated
node_type.deleted
edge_type.created
edge_type.updated
edge_type.deleted
node.created
node.updated
node.deleted
edge.created
edge.updated
edge.deleted
view.created
view.updated
view.deleted
layout.created
layout.updated
layout.deleted
member.added
member.updated
member.removed
```

## Compatibility aliases

Temporary campaign aliases remain available for migration:

```txt
GET    /campaigns
POST   /campaigns
GET    /campaigns/{projectID}
PUT    /campaigns/{projectID}
DELETE /campaigns/{projectID}
GET    /campaigns/{projectID}/graph
```

The frontend should migrate to `/projects`, `/nodes`, `/edges`, `/node-types`, and `/edge-types`.
