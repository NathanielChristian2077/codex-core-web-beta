-- +goose Up
CREATE OR REPLACE FUNCTION notify_project_event()
RETURNS trigger AS $$
DECLARE
  record_data jsonb;
  project_uuid uuid;
  event_type text;
  record_id uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    record_data := to_jsonb(OLD);
  ELSE
    record_data := to_jsonb(NEW);
  END IF;

  IF TG_TABLE_NAME = 'projects' THEN
    project_uuid := (record_data ->> 'id')::uuid;
  ELSE
    project_uuid := (record_data ->> 'project_id')::uuid;
  END IF;

  record_id := (record_data ->> 'id')::uuid;

  event_type := CASE TG_TABLE_NAME
    WHEN 'projects' THEN 'project.' || lower(TG_OP)
    WHEN 'node_types' THEN 'node_type.' || lower(TG_OP)
    WHEN 'edge_types' THEN 'edge_type.' || lower(TG_OP)
    WHEN 'nodes' THEN 'node.' || lower(TG_OP)
    WHEN 'edges' THEN 'edge.' || lower(TG_OP)
    WHEN 'views' THEN 'view.' || lower(TG_OP)
    WHEN 'layouts' THEN 'layout.' || lower(TG_OP)
    WHEN 'memberships' THEN 'member.' || lower(TG_OP)
    ELSE TG_TABLE_NAME || '.' || lower(TG_OP)
  END;

  event_type := replace(event_type, '.insert', '.created');
  event_type := replace(event_type, '.update', '.updated');
  event_type := replace(event_type, '.delete', '.deleted');
  event_type := replace(event_type, 'member.created', 'member.added');
  event_type := replace(event_type, 'member.deleted', 'member.removed');

  PERFORM pg_notify(
    'codex_project_events',
    json_build_object(
      'type', event_type,
      'projectId', project_uuid,
      'payload', json_build_object(
        'projectId', project_uuid,
        'id', record_id,
        'table', TG_TABLE_NAME,
        'operation', lower(TG_OP),
        'record', record_data
      )
    )::text
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_notify_project_event AFTER UPDATE OR DELETE ON projects FOR EACH ROW EXECUTE FUNCTION notify_project_event();
CREATE TRIGGER memberships_notify_project_event AFTER INSERT OR UPDATE OR DELETE ON memberships FOR EACH ROW EXECUTE FUNCTION notify_project_event();
CREATE TRIGGER node_types_notify_project_event AFTER INSERT OR UPDATE OR DELETE ON node_types FOR EACH ROW EXECUTE FUNCTION notify_project_event();
CREATE TRIGGER edge_types_notify_project_event AFTER INSERT OR UPDATE OR DELETE ON edge_types FOR EACH ROW EXECUTE FUNCTION notify_project_event();
CREATE TRIGGER nodes_notify_project_event AFTER INSERT OR UPDATE OR DELETE ON nodes FOR EACH ROW EXECUTE FUNCTION notify_project_event();
CREATE TRIGGER edges_notify_project_event AFTER INSERT OR UPDATE OR DELETE ON edges FOR EACH ROW EXECUTE FUNCTION notify_project_event();
CREATE TRIGGER views_notify_project_event AFTER INSERT OR UPDATE OR DELETE ON views FOR EACH ROW EXECUTE FUNCTION notify_project_event();
CREATE TRIGGER layouts_notify_project_event AFTER INSERT OR UPDATE OR DELETE ON layouts FOR EACH ROW EXECUTE FUNCTION notify_project_event();

-- +goose Down
DROP TRIGGER IF EXISTS layouts_notify_project_event ON layouts;
DROP TRIGGER IF EXISTS views_notify_project_event ON views;
DROP TRIGGER IF EXISTS edges_notify_project_event ON edges;
DROP TRIGGER IF EXISTS nodes_notify_project_event ON nodes;
DROP TRIGGER IF EXISTS edge_types_notify_project_event ON edge_types;
DROP TRIGGER IF EXISTS node_types_notify_project_event ON node_types;
DROP TRIGGER IF EXISTS memberships_notify_project_event ON memberships;
DROP TRIGGER IF EXISTS projects_notify_project_event ON projects;
DROP FUNCTION IF EXISTS notify_project_event();
