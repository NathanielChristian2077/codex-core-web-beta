# Codex Core — Narrative Graph & Timeline System

Codex Core is a full web application for building, organizing and visualizing narrative worlds through an interactive **timeline** and **graph**.  
It was developed as the final project for the **Introdução ao Desenvolvimento Web (IFSC)** course, following the requirements of the assignment (SPA + API, authentication, CRUD, validation, documentation, deploy, etc).

---

## Table of Contents

1. [Problem](#1-problem)
2. [Actors & Stakeholders](#2-actors--stakeholders)
3. [Use Cases](#3-use-cases)
4. [Constraints & Assumptions](#4-constraints--assumptions)
5. [Hypotheses & Validation](#5-hypotheses--validation)
6. [Main Flow & First Vertical Slice](#6-main-flow--first-vertical-slice)
7. [Wireframes](#7-wireframes)
8. [Technologies](#8-technologies)
9. [Data Plan (Day 0)](#9-data-plan-day-0)
10. [System Architecture](#10-system-architecture)
11. [Features](#11-features)
12. [Authentication & Security](#12-authentication--security)
13. [API Endpoints](#13-api-endpoints)
14. [Running the Project Locally](#14-running-the-project-locally)
15. [Environment Variables](#15-environment-variables)
16. [Deployment](#16-deployment)
17. [Sequence Diagrams (Mermaid)](#17-sequence-diagrams-mermaid)
18. [Assignment Compliance Checklist](#18-assignment-compliance-checklist)
19. [License](#19-license)

---

## 1) Problem

Game masters running narrative RPG campaigns (online or in person) struggle to **organize, visualize and communicate** the timeline of events and the relationships between characters, locations and objects.

Consequences:

- Loss of narrative consistency over time  
- Harder and slower session preparation  
- Players get confused about what happened, when and with whom  
- Less mental space for complex, interesting stories

Codex Core focuses first on the **Game Master**, providing an interactive timeline and graph that connects events and narrative elements, making it easier to prepare and run sessions.

---

## 2) Actors & Stakeholders

### Main Users

- **Game Master (GM)**  
  Creates and manages campaigns, events and narrative elements. Primary user.

- **Player**  
  Consults campaigns they participate in, views events, characters, locations and objects.

### Decision Makers / Support

- **System Administrator**  
  Manages users and monitors usage; may intervene in edge cases or maintenance.

- **Developers / Technical Team**  
  Maintain and evolve the system.

---

## 3) Use Cases

### All Users

- Log in / log out
- Maintain basic profile data (name, email, password)
- Access campaigns they own or participate in

### Game Master

- Maintain campaigns (create / list / edit / delete)
- Create and organize **events** in a timeline
- Associate **characters, locations and objects** to events
- Visualize and manipulate the interactive timeline
- Define relations between events (before / after / parallel)
- Navigate the graph of entities and relations

### Player

- View the timeline of a campaign they are part of
- Navigate event relationships
- View related characters, locations and objects

### Administrator

- Manage user accounts (create / edit / remove)
- Monitor system usage and adjust permissions
- Support in case of inconsistencies

---

## 4) Constraints & Assumptions

### Constraints

- Final delivery (MVP) date: **2025-11-30**
- Must run on modern browsers (Chrome/Firefox/Edge)
- Must support multiple users; each campaign has **1 GM** and multiple players
- Timeline must be interactive and based on a **graph visualization**
- First version uses only **open-source** tools/services

### Assumptions

- Users have stable internet during sessions
- Browsers are up-to-date and support graph rendering (SVG/Canvas)
- The team uses GitHub for version control and collaboration
- Time for short test sessions (10–15 minutes each) is available

### Plan B

- If internet is unavailable: system can run locally (dev mode), and campaigns can be exported/imported via JSON.
- If graph rendering is not supported: show a simplified list-based chronological view of events.
- If there isn’t enough time for full class testing: validate with at least 3 representative users (GM + players) in reduced scenarios.

---

## 5) Hypotheses & Validation

### H-Value (Value Hypothesis)

> If GMs and players can visualize events and relationships as an interactive graph, then understanding the timeline will be clearer and faster.

**Validation:**

- Test with **5 users** (3 GMs, 2 players).
- Target: ≥ 4 users can navigate the graph, locate an event and explain its relationships within **2 minutes** without instructor help.

### H-Feasibility (Technical Hypothesis)

> Using React on the frontend and NestJS on the backend, loading and displaying a timeline with up to **50 events** and **150 relations** should take ≤ 2 seconds in most cases.

**Validation:**

- Measure load time across **30 timeline views**.
- Target: ≥ 27 out of 30 (90%) load in ≤ 2 seconds.

---

## 6) Main Flow & First Vertical Slice

### Main User Flow

1. User logs into the system  
2. Selects a campaign  
3. Creates/edits a narrative event (with characters, locations and objects)  
4. System saves the event and updates the visual timeline and graph  

### First Vertical Slice (Minimum Scope)

Includes:

- Simple login screen
- Campaign list screen → select a campaign
- Timeline screen → create event (title + description)
- Persist event to DB → refresh timeline

**Acceptance Criteria:**

- After creating an event, it appears immediately on the timeline.
- Refreshing the page keeps the event (persisted in DB).

---

## 7) Wireframes

Initial sketches used to guide UI/UX decisions:

![Wireframe 1](https://github.com/user-attachments/assets/15cc244c-f83b-4bd5-8b08-27debcda853c)

![Wireframe 2](https://github.com/user-attachments/assets/7ff93685-6bca-46d5-98d1-10e5c2ff1f9a)

---

## 8) Technologies

### 8.1 Browser / Frontend

- **Framework:** React + TypeScript
- **Build tool:** Vite
- **State management:** Zustand
- **Styling:** Tailwind CSS
- **Graph / visualization:** D3-force (and related utilities)
- **Local caching:** Local usage for minor UI state (not for authentication tokens)
- **Hosting:** Vercel

### 8.2 Frontend (Application Layer)

- Single Page Application (SPA) served as static assets
- Communicates with backend via REST API (JSON)
- Uses Axios with `withCredentials` to handle cookies (auth + CSRF)

### 8.3 Backend (API / Server)

- **Framework:** NestJS (Node.js, TypeScript)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT stored in **HttpOnly cookies**
- **Password hashing:** bcrypt
- **CSRF protection:** `csurf` + `cookie-parser`
- **Hosting:** Railway

---

## 9) Data Plan (Day 0)

### 9.1 Entities

- **User** — person using the system (GM or player)
- **Campaign** — narrative world created and maintained by users
- **Event** — narrative event within a campaign with temporal relations
- **Character** — active entity in events
- **Location** — place related to events and characters
- **Object** — item that appears in events, locations or with characters
- **Relation** — generic relationship between any two entities (event–event, event–character, character–location, etc.)

### 9.2 Fields per Entity (Conceptual)

#### User

| Field    | Type                      | Required | Example                |
|----------|---------------------------|----------|------------------------|
| id       | uuid                      | yes      | `u1-123-xyz`           |
| name     | text                      | yes      | `Ana Souza`            |
| email    | text (unique)             | yes      | `ana@example.com`      |
| password | hashed text (bcrypt)      | yes      | `$2a$10$hash...`       |
| role     | ENUM('GM','PLAYER',...)   | yes      | `GM`                   |

#### Campaign

| Field       | Type         | Required | Example                        |
|-------------|--------------|----------|--------------------------------|
| id          | uuid         | yes      | `c1-555`                       |
| name        | text         | yes      | `Fall of the Realms`           |
| description | text         | no       | `War between ancient kingdoms` |
| imageUrl    | text         | no       | `https://.../campaign.png`     |
| ownerId     | uuid (User)  | yes      | `u1-123-xyz`                   |

#### Event

| Field       | Type            | Required | Example               |
|-------------|-----------------|----------|-----------------------|
| id          | uuid            | yes      | `e1-444`              |
| title       | text            | yes      | `Battle of Aranor`    |
| description | text (Markdown) | no       | `Confronto decisivo`  |
| campaignId  | uuid (Campaign) | yes      | `c1-555`              |
| createdAt   | datetime        | yes      |                       |

#### Character

| Field       | Type            | Required | Example         |
|-------------|-----------------|----------|-----------------|
| id          | uuid            | yes      | `p1-222`        |
| name        | text            | yes      | `King Darius`   |
| description | text            | no       | `Cruel monarch` |
| imageUrl    | text            | no       |                 |
| campaignId  | uuid (Campaign) | yes      | `c1-555`        |

#### Location

| Field       | Type            | Required | Example            |
|-------------|-----------------|----------|--------------------|
| id          | uuid            | yes      | `l1-999`           |
| name        | text            | yes      | `Black Castle`     |
| description | text            | no       | `Ancient fortress` |
| imageUrl    | text            | no       |                    |
| campaignId  | uuid (Campaign) | yes      | `c1-555`           |

#### Object

| Field       | Type            | Required | Example              |
|-------------|-----------------|----------|----------------------|
| id          | uuid            | yes      | `o1-888`             |
| name        | text            | yes      | `Sacred Sword`       |
| description | text            | no       | `Legendary artifact` |
| imageUrl    | text            | no       |                      |
| campaignId  | uuid (Campaign) | yes      | `c1-555`             |

#### Relation (Generic)

Represents any relation between two entities (event–character, character–location, event–event, etc.)

| Field    | Type        | Required | Example      |
|----------|-------------|----------|--------------|
| id       | uuid        | yes      | `r1-123`     |
| fromId   | uuid        | yes      | `e1-444`     |
| fromType | text (enum) | yes      | `EVENT`      |
| toId     | uuid        | yes      | `p1-222`     |
| toType   | text (enum) | yes      | `CHARACTER`  |
| kind     | text        | yes      | `APPEARS_IN` |

### 9.3 Conceptual Relationships

- **User** → owns → **Campaigns**  
- **Campaign** → contains → **Events, Characters, Locations, Objects**  
- **Events** → can be related to other events (temporal chains: before/after/parallel)  
- **Events** → can be linked to Characters, Locations and Objects  
- **All narrative entities** can be linked via `Relation` and visualized in the graph  

---

## 10. System Architecture

### 10.1 Overview

Codex Core follows a **SPA + API** architecture:

- **Frontend:** React SPA (Vite), deployed on Vercel  
- **Backend:** NestJS REST API, deployed on Railway  
- **Database:** PostgreSQL (managed on Railway)  
- **Communication:** HTTPS + JSON, Axios on the client

### 10.2 C4 – Level 1: System Context

- **User (Browser)** accesses the Codex Core SPA.  
- The SPA calls the **Codex Core API**.  
- The API talks to **PostgreSQL** via Prisma.  
- Auth is handled via **JWT in HttpOnly cookies**.

```mermaid
C4Context
title Codex Core - System Context

Person(user, "User", "Game Master, Player or Admin using the browser")

System_Boundary(codex, "Codex Core") {
  System(spa, "Codex Core Web App", "React SPA", "Timeline + narrative graph UI")
  System(api, "Codex Core API", "NestJS REST API", "Business logic, auth and persistence")
}

SystemDb(db, "PostgreSQL Database", "Relational DB", "Stores users, campaigns, events and relations")

Rel(user, spa, "Uses via browser", "HTTPS")
Rel(spa, api, "Calls REST endpoints", "HTTPS / JSON")
Rel(api, db, "Reads and writes data", "Prisma / SQL")
```

### 10.3 C4 – Level 2: Container Diagram

- **Web App (SPA):**  
  - React, TypeScript, Vite  
  - Zustand for global state (session, graph state, UI)  
  - Tailwind CSS for styling  
  - D3-force for graph layout

- **API (Backend):**  
  - NestJS modules: Auth, Users, Campaigns, Events, Characters, Locations, Objects, Relations, Graph  
  - Prisma for DB access  
  - JWT strategy + guards  
  - CSRF protection (`csurf` + cookies)

- **Database:**  
  - PostgreSQL: stores users, campaigns, events, entities, relations

```mermaid
C4Container
  title Codex Core - Container Diagram
  Person(user, "User", "Game Master, Player or Admin")
  System_Boundary(codex, "Codex Core") {
    Container(web, "Web SPA", "React + Vite + TypeScript","Single Page Application for managing campaigns, events and entities")
    Container(api, "Codex Core API", "NestJS (Node.js, TypeScript)", "Exposes REST endpoints, handles auth (JWT in HttpOnly cookies), CSRF, validation and domain logic")
    ContainerDb(db, "PostgreSQL", "Relational Database", "Persistent storage for users, campaigns, events, characters, locations, objects and relations")
  }

  Rel(user, web, "Uses (HTTPS)")
  Rel(web, api, "Makes JSON requests (Axios over HTTPS)")
  Rel(api, db, "Reads and writes (Prisma / SQL)")
```

## 10.4 C4 – Level 3A: Component Diagram (Frontend / Web SPA)

```mermaid
C4Component
  title Codex Core - Frontend Components (Web SPA)

  Person(user, "User", "GM / Player / Admin")

  Container_Boundary(web, "Web SPA (React + Vite)") {
    
    Component(appShell, "App Shell & Routing", "React + React Router", "Top-level layout, navigation, route management")

    Component(loginPage, "LoginPage / SignupPage", "React Component", "Handles user login and registration using auth API")

    Component(dashboardPage, "DashboardPage", "React Component", "High-level campaign list and navigation entry point")

    Component(campaignPage, "CampaignPage", "React Component", "Campaign overview, header, navigation between timeline and graph")

    Component(timelinePage, "TimelinePage", "React Component", "Lists and edits events in timeline form, opens event modals")

    Component(graphView, "GraphView / GraphCanvas", "React + D3-force", "Renders the narrative graph, nodes for entities and edges for relations")

    Component(apiClient, "apiClient", "Axios wrapper", "Centralized HTTP client with base URL, withCredentials and CSRF header")

    Component(sessionStore, "useSession", "Zustand Store", "Keeps current user, login state and logout / loadSession logic")

    Component(graphStore, "GraphContext / GraphStore", "React Context + Zustand", "Caches graph nodes/edges, filters, selection and layout state")
  }

  Rel(user, appShell, "Interacts via UI", "Browser")
  Rel(appShell, loginPage, "Navigates to", "React Router")
  Rel(appShell, dashboardPage, "Navigates to", "React Router")
  Rel(dashboardPage, campaignPage, "Opens", "Route")
  Rel(campaignPage, timelinePage, "Opens", "Route / tab")
  Rel(campaignPage, graphView, "Opens", "Route / tab")

  Rel(loginPage, apiClient, "Calls /auth/login and /auth/register", "Axios")
  Rel(sessionStore, apiClient, "Calls /auth/me and /auth/logout", "Axios")
  Rel(timelinePage, apiClient, "Calls /events CRUD", "Axios")
  Rel(graphView, apiClient, "Loads graph data", "Axios")

  Rel(graphView, graphStore, "Reads/writes graph state", "In-memory")
  Rel(campaignPage, sessionStore, "Reads current user / auth state", "In-memory")
```

## 10.5 C4 – Level 3B: Component Diagram (Backend / API)

```mermaid
C4Component
    title Codex Core - Backend Components (API)

    Container_Boundary(api, "Codex Core API (NestJS)") {
        Component(authController, "AuthController", "NestJS Controller", "Handles /auth/login, /auth/register, /auth/me, /auth/logout")
        Component(authService, "AuthService", "NestJS Service", "Validates credentials, hashes passwords, generates JWTs")
        Component(jwtStrategy, "JwtStrategy", "Passport Strategy", "Extracts JWT from HttpOnly cookie and validates it")
        Component(authGuard, "AuthGuard (jwt)", "NestJS Guard", "Protects routes that require authentication")
        Component(userModule, "Users / Profile Module", "NestJS Module", "Optionally handles user profile updates, password change, etc.")
        Component(campaignsController, "CampaignsController", "NestJS Controller", "CRUD for campaigns")
        Component(campaignsService, "CampaignsService", "NestJS Service", "Business logic for campaigns")
        Component(eventsController, "EventsController", "NestJS Controller", "CRUD for events")
        Component(eventsService, "EventsService", "NestJS Service", "Business logic for events, including parsing tokens for relations")
        Component(entitiesController, "Characters/Locations/Objects Controllers", "NestJS Controllers", "CRUD for narrative entities: characters, locations, objects")
        Component(entitiesService, "Entities Services", "NestJS Services", "Logic for narrative entities and associations")
        Component(relationsController, "RelationsController", "NestJS Controller", "CRUD for generic relations between entities")
        Component(relationsService, "RelationsService", "NestJS Service", "Manages creation and cleanup of graph relations")
        Component(graphController, "GraphController", "NestJS Controller", "Provides graph data for a campaign (nodes + edges)")
        Component(graphService, "GraphService", "NestJS Service", "Aggregates entities and relations into a graph model")
        Component(prismaService, "PrismaService", "NestJS Injectable", "Centralized DB access for all modules")
        Component(csrfMiddleware, "CSRF Middleware", "csurf + cookie-parser", "Generates and validates CSRF tokens using cookies")
    }

    ContainerDb(db, "PostgreSQL", "Relational DB", "Persistent data storage")

    Rel(authController, authService, "Uses", "NestJS DI")
    Rel(authService, prismaService, "Reads/writes users", "Prisma")
    Rel(jwtStrategy, prismaService, "Optionally loads user", "Prisma")
    Rel(authGuard, jwtStrategy, "Delegates authentication", "Passport")
    Rel(campaignsController, campaignsService, "Uses", "NestJS DI")
    Rel(campaignsService, prismaService, "Reads/writes campaigns", "Prisma")
    Rel(eventsController, eventsService, "Uses", "NestJS DI")
    Rel(eventsService, prismaService, "Reads/writes events", "Prisma")
    Rel(eventsService, relationsService, "Creates relations from tokens", "Service call")
    Rel(entitiesController, entitiesService, "Uses", "NestJS DI")
    Rel(entitiesService, prismaService, "Reads/writes characters/locations/objects", "Prisma")
    Rel(relationsController, relationsService, "Uses", "NestJS DI")
    Rel(relationsService, prismaService, "Reads/writes relations", "Prisma")
    Rel(graphController, graphService, "Uses", "NestJS DI")
    Rel(graphService, prismaService, "Aggregates from all tables", "Reads data")
    Rel(prismaService, db, "Connects to", "PostgreSQL / SQL")
```

---

## 11. Features

### 11.1 User & Authentication

- Register with email + password  
- Login with email + password  
- View current user (`/auth/me`)  
- Logout  
- Passwords stored with **bcrypt hashing**  
- Session via **JWT in HttpOnly cookies**  
- Client syncs session via `/auth/me`

### 11.2 Campaign Management

- Create / list / update / delete campaigns  
- Campaign header with cover image, name and description  
- Each campaign encapsulates its own events and entities

### 11.3 Events & Timeline

- Create events with title + Markdown description  
- Events displayed in a timeline for the current campaign  
- Clicking an event opens details / edit modal  
- Events persist in DB and reload on refresh  

### 11.4 Characters, Locations, Objects

For each entity type:

- List, create, update, delete  
- Associate them to events via the UI  
- Show summaries and details

### 11.5 Automatic Relations from Text Tokens

Inside event descriptions (Markdown), tokens like:

- `<<C:Bilbo Baggins>>`  
- `<<L:Shire>>`  
- `<<O:Ring>>`  
- `<<E:Unexpected Party>>`

are parsed and transformed into **relations**.  
This keeps the graph in sync with the narrative text and removes manual bookkeeping.

### 11.6 Graph View

- Uses a force-directed layout (D3-force)  
- Each node represents an entity (event, character, location, object)  
- Edges represent relations (appearance, location, ownership, temporal links, etc.)  
- Features:
  - Drag to reposition nodes  
  - Zoom & pan  
  - Highlight neighbors / BFS expansion around a node  
  - Filter by entity type and relation type  

### 11.7 Timeline & Graph Integration

- Events created on the timeline appear as nodes in the graph  
- Edits in events/relations are reflected in both views  
- Quick info popup for nodes on hover/click

---

## 12. Authentication & Security

### 12.1 Authentication Flow

- Login and registration handled by `/auth/login` and `/auth/register`
- On success, the backend:
  - Generates a JWT for the user
  - Stores it in an **HttpOnly `accessToken` cookie**
- Frontend:
  - Does **not** see or store the token
  - Uses Axios with `withCredentials: true`
  - Loads current user via `/auth/me`

### 12.2 Passwords

- All passwords are hashed using **bcrypt** before being stored.
- The system never stores plain text passwords.

### 12.3 CSRF Protection

- Backend uses `cookie-parser` + `csurf`.
- CSRF tokens are stored in an HttpOnly cookie (`_csrf`) and exposed to the frontend in another cookie (`XSRF-TOKEN`).
- Frontend:
  - Reads `XSRF-TOKEN` from `document.cookie`
  - Sends it in the `X-CSRF-Token` header for **mutating requests** (POST/PUT/PATCH/DELETE)
- Certain auth routes (e.g. `/auth/login`, `/auth/register`) can be excluded from CSRF validation to avoid bootstrap deadlocks.

### 12.4 Input Validation

- Backend uses **class-validator** (`RegisterDto`, etc.) for DTO validation.
- Frontend performs basic validation (email regex, minimum password length).

### 12.5 Environment & Secrets

- `.env` files are not committed  
- `.env.example` is provided with placeholder variables  
- **JWT_SECRET** is required in the backend environment  

---

## 13. API Endpoints

### 13.1 Auth

| Method | Route           | Description                         |
|--------|-----------------|-------------------------------------|
| POST   | `/auth/register`| Register a new user                 |
| POST   | `/auth/login`   | Login and set auth cookies          |
| POST   | `/auth/logout`  | Clear auth cookies                  |
| GET    | `/auth/me`      | Return current authenticated user   |

### 13.2 Users (optional)

- Could expose `/users/me`, `/users` for admin management if required.

### 13.3 Campaigns

| Method | Route              | Description              |
|--------|--------------------|--------------------------|
| GET    | `/campaigns`       | List campaigns           |
| POST   | `/campaigns`       | Create a campaign        |
| GET    | `/campaigns/:id`   | Get campaign details     |
| PATCH  | `/campaigns/:id`   | Update a campaign        |
| DELETE | `/campaigns/:id`   | Delete a campaign        |

### 13.4 Events

| Method | Route            | Description                 |
|--------|------------------|-----------------------------|
| GET    | `/events`        | List events (by campaign)   |
| POST   | `/events`        | Create an event             |
| GET    | `/events/:id`    | Get event details           |
| PATCH  | `/events/:id`    | Update an event             |
| DELETE | `/events/:id`    | Delete an event             |

### 13.5 Other Entities

Similar CRUD endpoints for:

- `/characters`
- `/locations`
- `/objects`
- `/relations`

---

## 14. Running the Project Locally

### 14.1 Backend

```bash
cd backend
npm install

# Prisma client & migrations
npx prisma generate
npx prisma migrate dev

# Start dev server
npm run start:dev
```

Backend will run on `http://localhost:3000` by default.

### 14.2 Frontend

```bash
cd frontend
npm install

# Start dev server
npm run dev
```

Frontend will run on something like `http://localhost:5173` (Vite default).  
Ensure `VITE_API_URL` points to the backend URL (see env section).

---

## 15. Environment Variables

### 15.1 Backend (`backend/.env.example`)

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-secret"
PORT=3000

# For CORS
FRONTEND_ORIGIN="http://localhost:5173"
```

### 15.2 Frontend (`frontend/.env.example`)

```env
VITE_API_URL="http://localhost:3000"
```

In production, `VITE_API_URL` should point to the Railway backend URL, and `FRONTEND_ORIGIN` in the backend should match the Vercel frontend URL.

---

## 16. Deployment

- **Frontend:** Vercel  
  - Builds the React/Vite SPA  
  - Serves static files over HTTPS  

- **Backend:** Railway  
  - Runs the NestJS API  
  - Exposed over HTTPS  

- **Database:** PostgreSQL on Railway  

CORS and cookies are configured for **cross-site** usage:

- `withCredentials: true` in Axios  
- `accessToken` cookie with `httpOnly: true`, `secure: true`, `sameSite: 'none'` (in production)  
- CSRF cookies (`_csrf`, `XSRF-TOKEN`) aligned with the same policy  

---

## 17. Sequence Diagrams (Mermaid)

### 17.1 Login Flow

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant L as LoginPage (React)
    participant S as useSession (Zustand)
    participant API as apiClient (axios)
    participant AC as AuthController (/auth)
    participant AS as AuthService
    participant DB as Prisma
    participant JS as JwtStrategy/AuthGuard

    U ->> L: Access /login
    L -->> U: Render login form

    U ->> L: Fill email + password<br/>and click "Sign in"
    L ->> API: POST /auth/login<br/>{ email, password }<br/>+ X-CSRF-Token

    API ->> AC: POST /auth/login
    AC ->> AS: login(email, password)
    AS ->> DB: findUnique({ email })
    DB -->> AS: user
    AS ->> AS: bcrypt.compare(password, user.password)
    AS ->> AS: jwt.sign(payload)
    AS -->> AC: { accessToken, user }

    AC ->> API: Set-Cookie accessToken (HttpOnly)<br/>Set-Cookie XSRF-TOKEN<br/>Body: user
    API -->> L: user

    L ->> S: loadSession()
    S ->> API: GET /auth/me<br/>withCredentials
    API ->> JS: Validate JWT from cookie
    JS -->> AC: req.user
    AC -->> API: user
    API -->> S: user
    S -->> L: isLogged = true

    L ->> U: Redirect to /dashboard
```

### 17.2 Registration (Signup) Flow

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant P as SignupPage (React)
    participant S as useSession (Zustand)
    participant API as apiClient (axios)
    participant AC as AuthController
    participant AS as AuthService
    participant DB as Prisma
    participant JS as JwtStrategy/AuthGuard

    U ->> P: Open "Create Account" form
    P -->> U: Render signup form

    U ->> P: Fill email + password + confirm
    P ->> API: POST /auth/register<br/>{ email, password }<br/>withCredentials + X-CSRF-Token

    API ->> AC: POST /auth/register
    AC ->> AS: register(dto)
    AS ->> DB: findUnique(email)
    DB -->> AS: null (no existing user)
    AS ->> AS: bcrypt.hash(password)
    AS ->> DB: create(user)
    DB -->> AS: user
    AS ->> AS: jwt.sign(payload)
    AS -->> AC: { accessToken, user }

    AC ->> API: Set-Cookie accessToken (HttpOnly)<br/>Set-Cookie XSRF-TOKEN<br/>Body: user
    API -->> P: user

    P ->> S: loadSession()
    S ->> API: GET /auth/me<br/>withCredentials
    API ->> JS: Validate cookie JWT
    JS -->> AC: req.user
    AC -->> API: user
    API -->> S: user
    S -->> P: isLogged = true

    P ->> U: Redirect to /dashboard<br/>+ "Account created" message
```

### 17.3 Event Creation Flow

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant T as TimelinePage (React)
    participant API as apiClient (axios)
    participant EC as EventsController (/events)
    participant AG as AuthGuard/JwtStrategy
    participant ES as EventsService
    participant DB as Prisma

    U ->> T: Access /campaign/:id/timeline
    T -->> U: Render timeline + "New event" button

    U ->> T: Click "New event"<br/>Fill title + description
    T ->> API: POST /events<br/>{ title, description, campaignId }<br/>+ X-CSRF-Token

    API ->> AG: POST /events (with cookies)
    AG ->> AG: Validate JWT from cookie
    AG -->> EC: req.user populated

    EC ->> ES: createEvent(dto, req.user)
    ES ->> DB: prisma.event.create({ data: ... })
    DB -->> ES: event
    ES -->> EC: event

    EC -->> API: 201 Created<br/>{ event }
    API -->> T: event

    T ->> T: Add event to timeline & graph
    T -->> U: Updated timeline with new event
```

---

## 18. Assignment Compliance Checklist

Based on the IFSC Web Development final project requirements, Codex Core includes:

- **SPA + API architecture** ✔  
- **User CRUD / management** (register, login, profile via `/auth/me`) ✔  
- **Authentication with hashed passwords (bcrypt)** ✔  
- **JWT-based session, stored in HttpOnly cookies** ✔  
- **CSRF protection when using cookies** (csurf + XSRF header) ✔  
- **At least two full resources with CRUD** (Campaigns, Events, Characters, Locations, Objects) ✔  
- **Server-side and client-side validation** ✔  
- **Clear documentation (README)** ✔  
- **`.env.example` files** ✔  
- **Deployed frontend and backend** ✔  
- **Diagrams and system description** (flows, data model, sequence diagrams) ✔  

---

## 19. License

This project is released under the **MIT License**.
