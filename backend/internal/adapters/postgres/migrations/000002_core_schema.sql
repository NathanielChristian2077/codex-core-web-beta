-- +goose Up
CREATE EXTENSION IF NOT EXISTS citext;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email citext NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id)
);

CREATE TABLE node_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  color text,
  icon text,
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, slug)
);

CREATE TABLE edge_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  directed boolean NOT NULL DEFAULT true,
  color text,
  stroke_style text,
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, slug)
);

CREATE TABLE nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type_id uuid NOT NULL REFERENCES node_types(id) ON DELETE RESTRICT,
  title text NOT NULL,
  content text,
  properties jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source_node_id uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  target_node_id uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  type_id uuid NOT NULL REFERENCES edge_types(id) ON DELETE RESTRICT,
  properties jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (source_node_id <> target_node_id)
);

CREATE TABLE views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  mode text NOT NULL DEFAULT 'graph',
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  view_id uuid NOT NULL REFERENCES views(id) ON DELETE CASCADE,
  node_id uuid NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
  x double precision NOT NULL,
  y double precision NOT NULL,
  locked boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (view_id, node_id)
);

CREATE INDEX projects_owner_id_idx ON projects(owner_id);
CREATE INDEX memberships_user_id_idx ON memberships(user_id);
CREATE INDEX memberships_project_id_idx ON memberships(project_id);
CREATE INDEX node_types_project_id_idx ON node_types(project_id);
CREATE INDEX edge_types_project_id_idx ON edge_types(project_id);
CREATE INDEX nodes_project_id_idx ON nodes(project_id);
CREATE INDEX nodes_type_id_idx ON nodes(type_id);
CREATE INDEX nodes_title_trgm_idx ON nodes USING gin (to_tsvector('simple', title));
CREATE INDEX edges_project_id_idx ON edges(project_id);
CREATE INDEX edges_source_node_id_idx ON edges(source_node_id);
CREATE INDEX edges_target_node_id_idx ON edges(target_node_id);
CREATE INDEX edges_type_id_idx ON edges(type_id);
CREATE INDEX views_project_id_idx ON views(project_id);
CREATE INDEX layouts_view_id_idx ON layouts(view_id);
CREATE INDEX layouts_node_id_idx ON layouts(node_id);

CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER projects_set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER memberships_set_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER node_types_set_updated_at BEFORE UPDATE ON node_types FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER edge_types_set_updated_at BEFORE UPDATE ON edge_types FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER nodes_set_updated_at BEFORE UPDATE ON nodes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER edges_set_updated_at BEFORE UPDATE ON edges FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER views_set_updated_at BEFORE UPDATE ON views FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- +goose Down
DROP TABLE IF EXISTS layouts;
DROP TABLE IF EXISTS views;
DROP TABLE IF EXISTS edges;
DROP TABLE IF EXISTS nodes;
DROP TABLE IF EXISTS edge_types;
DROP TABLE IF EXISTS node_types;
DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;
DROP FUNCTION IF EXISTS set_updated_at();
