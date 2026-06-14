# Codex Core — Frontend

React + TypeScript + Vite SPA for Codex Core (narrative graph & timeline).

This document describes the **frontend architecture after the migration to the
generic `Project / Node / Edge` backend**, the features that already talk to the
new API, and — most importantly — **what the backend still needs to expose so we
can use the frontend at full potential**.

> The UI still says "Campaign", "Character", "Location", "Object" and "Event".
> Internally those are just **Projects** and **Nodes** of a given **NodeType**.
> The RPG vocabulary is a presentation detail; the code is generic.

---

## Table of Contents

1. [Tech stack](#1-tech-stack)
2. [Project layout](#2-project-layout)
3. [The API layer](#3-the-api-layer)
4. [Authentication (cookie + CSRF)](#4-authentication-cookie--csrf)
5. [Domain model & compatibility adapters](#5-domain-model--compatibility-adapters)
6. [Feature map](#6-feature-map)
7. [The graph (dynamic types + layout persistence)](#7-the-graph-dynamic-types--layout-persistence)
8. [Internal links](#8-internal-links)
9. [Running locally](#9-running-locally)
10. [Environment variables](#10-environment-variables)
11. [Backend requirements — what's missing](#11-backend-requirements--whats-missing)
12. [Migration status (PRs)](#12-migration-status-prs)

---

## 1) Tech stack

- **React 19** + **TypeScript** + **Vite 7**
- **React Router 7** for routing
- **Zustand** for session / current-campaign stores
- **axios** for HTTP (single configured client, see below)
- **d3-force** for the interactive graph simulation
- **Tailwind CSS 4** + Radix/animate-ui components
- **Vitest** + Testing Library for unit tests

---

## 2) Project layout

```
src/
  api/                      # NEW generic API layer (talks to Project/Node/Edge backend)
    client.ts               # axios instance (cookie + CSRF), single source of truth
    contracts/              # DTOs / request types (auth, project, node, edge, view)
    modules/                # one module per resource (auth, projects, nodes, edges, views, layouts, ...)
    index.ts                # re-exports: import { projectsApi, nodesApi } from "@/api"
  features/
    auth/      users/       # auth + user API wrappers (delegate to api/modules)
    campaigns/              # Campaign API = thin wrapper over Projects + Event nodes
    characters/ locations/ objects/   # wrappers over the generic Nodes API
    nodes/                  # adapters (Node <-> entity) + nodeTypeResolver
    graphs/                 # graph data, context, simulation, layout persistence
  components/               # UI (entity list/modal, graph canvas/panels, layout, markdown, ...)
  pages/                    # route pages (Dashboard, Graph, Timeline, _EntityPage, ...)
  store/                    # zustand stores (useSession, useCurrentCampaign)
  lib/                      # internalLinks, apiClient (legacy re-export), utils
```

**Rule:** pages and features never call `axios` directly. They go through
`api/modules/*` (or a feature wrapper that does). This keeps every endpoint in
one place.

---

## 3) The API layer

`src/api/client.ts` is the only configured axios instance:

- `baseURL = import.meta.env.VITE_API_URL`
- `withCredentials: true` (sends the auth cookie automatically)
- a request interceptor adds `X-CSRF-Token` on `POST/PUT/PATCH/DELETE`
- a response interceptor redirects to `/login` on `401`

Each resource has a module under `src/api/modules/`:

| Module | Main endpoints |
| --- | --- |
| `auth` | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`, `PATCH /auth/me`, `PATCH /auth/me/password`, `DELETE /auth/me`, `GET /auth/csrf` |
| `projects` | `GET/POST /projects`, `GET/PATCH/DELETE /projects/:id` |
| `nodeTypes` | `GET/POST /projects/:id/node-types`, `PATCH/DELETE /node-types/:id` |
| `nodes` | `GET/POST /projects/:id/nodes` (filters: `typeSlug`, `typeId`, `search`), `GET/PATCH/DELETE /nodes/:id` |
| `edgeTypes` | `GET/POST /projects/:id/edge-types`, `PATCH/DELETE /edge-types/:id` |
| `edges` | `GET/POST /projects/:id/edges`, `GET/PATCH/DELETE /edges/:id`, `GET /projects/:id/graph` |
| `views` | `GET/POST /projects/:id/views`, `PATCH/DELETE /views/:id` |
| `layouts` | `GET /views/:id/layout`, `PUT /views/:id/layout/nodes/:nodeId` |

Import them via the barrel:

```ts
import { projectsApi, nodesApi, layoutsApi } from "@/api";
```

---

## 4) Authentication (cookie + CSRF)

The frontend does **not** store an access token. Sessions are cookie-based:

- **Login / Register** → backend sets an **HttpOnly** auth cookie + a
  non-HttpOnly `XSRF-TOKEN` cookie. The response body is `{ user }`.
- **Session bootstrap** → `GET /auth/me` returns the current user **raw**
  (no `{ user }` wrapper). `useSession` calls it on app start.
- **Mutations** → the client reads `XSRF-TOKEN` and sends it as `X-CSRF-Token`.
  A fresh session may need `GET /auth/csrf` before the first mutation.
- **Logout** → `POST /auth/logout` clears the cookies; the store resets and the
  app redirects to `/login`.

`src/lib/apiClient.ts` is a legacy re-export of `api/client.ts` kept so older
imports keep working — there is no `localStorage` token anywhere.

---

## 5) Domain model & compatibility adapters

The old entities map onto the generic model like this:

| Old (UI) | New (backend) |
| --- | --- |
| Campaign | `Project` |
| Character / Location / Object / Event | `Node` (of a given `NodeType`) |
| type of entity | `NodeType` (has `slug`, `color`, `icon`, `fields`) |
| relation between entities | `Edge` (of an `EdgeType`) |
| graph positions / layout | `View` + `Layout` |

To avoid a big-bang refactor, feature wrappers keep the old names while calling
the new API:

- `features/campaigns/api.ts` — `listProjects/getProject/...` plus aliases
  `listCampaigns = listProjects`, etc. New projects are created with
  `presetSlug: "rpg-campaign"`, which seeds the node/edge types and a default
  view so the graph and entity pages work immediately.
- `features/{characters,locations,objects}/api.ts` and the event helpers wrap
  the generic **Nodes** API (`listNodes({ typeSlug })`, `createNode`, ...).
- `features/nodes/adapters.ts` — converts between a `Node` and the UI shape:
  - `title` ⇄ `name` / event `title`
  - `content` ⇄ `description`
  - `properties.imageUrl` ⇄ `imageUrl`
  - update payloads omit `properties` when `imageUrl` is undefined, so the
    backend `COALESCE` preserves existing properties.
- `features/nodes/nodeTypeResolver.ts` — resolve-or-create a `NodeType` id by
  slug (cached per project), so even a blank project can create nodes.

---

## 6) Feature map

- **Dashboard** — lists projects, create / manage / import campaigns.
- **Entity pages** (`pages/_EntityPage.tsx`) — Characters / Locations / Objects
  are a single generic page driven by `nodeTypeSlug`. It lists/creates/edits/
  deletes nodes of that type through the Nodes API.
- **Timeline** — events as nodes of type `event`.
- **Graph** — interactive force graph of nodes + edges (see next section).
- **Import / Export / Duplicate** — see [§11](#11-backend-requirements--whats-missing);
  the frontend now calls backend endpoints instead of copying graphs client-side.

---

## 7) The graph (dynamic types + layout persistence)

- **Dynamic types.** `GraphNodeType` is just `string`. Node colors, filters and
  style panels are derived from whatever types/relations are present, so new
  slugs (`faction`, `god`, `quest`, ...) render without code changes.
- **Adapter.** `features/graphs/adapters.ts` maps `GET /projects/:id/graph` into
  the internal `GraphData` (`node.title→label`, `node.type.slug→type`,
  `node.content→description`, `edge.sourceNodeId/targetNodeId/type.slug`).
- **Layout persistence (View/Layout).** Positions are stored on the backend,
  not in `localStorage`:
  - `features/graphs/useViewLayout.ts` resolves (or creates) the project's
    graph **View**, loads its **Layout** on open, and returns
    `initialPositions` + a `persistPositions` function.
  - `persistPositions` is **debounced (700ms, max-wait 1500ms)** and **diffs**
    against the last saved state, sending only nodes whose **rounded** position
    changed via `PUT /views/:id/layout/nodes/:nodeId`.
  - Dropping a node persists its final position **deterministically** via an
    `onNodeMoved` callback (independent of the physics "settle" event).
  - `GraphProvider` accepts `initialPositions` + `onPersistPositions`;
    `localStorage` remains only as a fallback for the auth-less **demo** page.

> There is no bulk layout endpoint on the backend, so the hook upserts changed
> nodes one-by-one in parallel. A bulk `PUT /views/:id/layout` would be a nice
> optimization (see §11) but is not required.

---

## 8) Internal links

`lib/internalLinks.ts` parses `<<type:Name>>` tokens inside markdown:

- New form: `<<character:Lady Vael>>`, `<<faction:...>>`, any `typeSlug`.
- Legacy aliases still accepted: `E→event`, `C→character`, `L→location`,
  `O→object`.
- `pathForNodeType(slug, projectId)` routes event/character/location/object to
  their dedicated pages; any other type falls back to the graph.

---

## 9) Running locally

From the **repo root** (starts Postgres + Go API; migrations auto-run):

```bash
docker compose up -d
```

Then the frontend:

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # tsc -b + vite build
npm run lint       # eslint
npm test           # vitest run (if/when tests exist)
```

Seed test user (already in the dev DB): `ebert@test.dev` / `password123`.

---

## 10) Environment variables

`frontend/.env`:

```
VITE_API_URL=http://localhost:9090
```

> The API host port is machine-specific. On some Windows machines port 8080 is
> reserved by WinNAT, so `docker-compose.override.yml` remaps the API to `9090`
> and `.env` points there. Adjust if your setup uses 8080.

The backend must allow CORS with credentials for the frontend origin
(`http://localhost:5173`) — an explicit origin, **not** a wildcard.

---

## 11) Backend requirements — what's missing

The frontend is already wired for these; the backend must implement them to
unlock full functionality.

### A) Import / Export / Duplicate (required — currently 404)

The frontend calls these and only handles loading/errors; the deep copy must
happen server-side:

| Method | Route | Body | Returns |
| --- | --- | --- | --- |
| `POST` | `/projects/:id/duplicate` | — | `ProjectDto` (the new project) |
| `GET`  | `/projects/:id/export` | — | a JSON snapshot (`ProjectExport`) |
| `POST` | `/projects/import` | the same JSON returned by `/export` | `ProjectDto` |

Requirements:
- `export` and `import` must use the **same JSON shape** (round-trip).
- `duplicate` and `import` must copy **nodes + edges + layout**, not just the
  project row.

Until these exist, the Duplicate/Export/Import buttons will error.

### B) Bulk layout upsert (optional optimization)

Today the frontend saves positions one node at a time via
`PUT /views/:id/layout/nodes/:nodeId`. A bulk endpoint would cut requests on
large drags:

| Method | Route | Body |
| --- | --- | --- |
| `PUT` | `/views/:id/layout` | `[{ nodeId, x, y, locked? }, ...]` |

If added, switch `useViewLayout.flush` to call it instead of the per-node loop.

### C) `NodeType.fields` for the dynamic form (PR9)

`NodeType` already carries a `fields` array in the contract, but the backend
returns it empty. Once it's populated (field `type`, `key`, `label`, options,
etc.), the entity modal can become a **DynamicNodeForm** that renders inputs per
field and writes them into `node.properties`. Today only
`title / content / properties.imageUrl` are used.

### D) Realtime (PR12)

A WebSocket channel emitting `node.*`, `edge.*`, `layout.updated`,
`presence.*` would let `useProjectRealtime(projectId)` update the list/graph
without a full reload. Lowest priority; REST works without it.

### E) Auth endpoints to confirm

`useSession` / the profile UI expect `PATCH /auth/me`, `PATCH /auth/me/password`
and `DELETE /auth/me`. Confirm they exist and match the contracts in
`src/api/contracts/auth.ts`.

---

## 12) Migration status (PRs)

| PR | Scope | Status |
| --- | --- | --- |
| 1–3 | API layer, auth (cookie/CSRF), adapters | done |
| 4 | Campaign → Project (+ aliases) | done |
| 5 | Character/Location/Object/Event as Node wrappers | done |
| 6 | Graph adapter (new shape, dynamic types) | done |
| 7 | Internal links (typeSlug + ECLO aliases) | done |
| 8 | EntityPage driven by `nodeTypeSlug` | done |
| 10 | Import/export/duplicate via backend | frontend done — needs §11.A |
| 11 | Graph layout via View/Layout | done |
| 9 | DynamicNodeForm | pending — needs §11.C |
| 12 | Realtime / WebSocket | pending — needs §11.D |
