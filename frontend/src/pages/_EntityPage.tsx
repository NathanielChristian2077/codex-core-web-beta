import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EntityList, { EntityBase } from "../components/entity/EntityList";
import EntityModal from "../components/entity/EntityModal";
import Spinner from "../components/layout/Spinner";
import { useToast } from "../components/layout/ToastProvider";
import type { InternalLink } from "../lib/internalLinks";

import * as nodesApi from "../api/modules/nodes";
import {
  entityToCreatePayload,
  entityToUpdatePayload,
  nodeToEntity,
} from "../features/nodes/adapters";
import { resolveNodeTypeId } from "../features/nodes/nodeTypeResolver";

type EntityPayload = {
  name: string;
  description?: string | null;
};

type Props = {
  title: string;
  /** id do projeto (antiga campanha) */
  projectId: string;
  /** slug do NodeType: "character" | "location" | "object" ... */
  nodeTypeSlug: string;
};

const SLUG_TO_KIND: Record<string, "E" | "C" | "L" | "O"> = {
  event: "E",
  character: "C",
  location: "L",
  object: "O",
};

function pathForKind(kind: "E" | "C" | "L" | "O", projectId: string): string {
  switch (kind) {
    case "E":
      return `/campaigns/${projectId}/timeline`;
    case "C":
      return `/campaigns/${projectId}/characters`;
    case "L":
      return `/campaigns/${projectId}/locations`;
    case "O":
      return `/campaigns/${projectId}/objects`;
  }
}

export default function EntityPage({ title, projectId, nodeTypeSlug }: Props) {
  const t = useToast();
  const navigate = useNavigate();

  const [items, setItems] = useState<EntityBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EntityBase | null>(null);
  const [initialName, setInitialName] = useState<string | undefined>();

  async function load() {
    try {
      setLoading(true);
      const nodes = await nodesApi.listNodes(projectId, {
        typeSlug: nodeTypeSlug,
      });
      setItems(nodes.map(nodeToEntity));
    } catch {
      t.show("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [projectId, nodeTypeSlug]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      await nodesApi.deleteNode(id);
      t.show("Deleted", "success");
      load();
    } catch {
      t.show("Failed to delete", "error");
    }
  }

  async function handleSave(payload: EntityPayload) {
    if (editing) {
      await nodesApi.updateNode(editing.id, entityToUpdatePayload(payload));
    } else {
      const typeId = await resolveNodeTypeId(projectId, nodeTypeSlug);
      await nodesApi.createNode(projectId, entityToCreatePayload(typeId, payload));
    }
  }

  const handleInternalLinkClick = (link: InternalLink) => {
    const pageKind = SLUG_TO_KIND[nodeTypeSlug];
    if (!pageKind) return;

    if (link.kind !== pageKind) {
      navigate(pathForKind(link.kind, projectId));
      return;
    }

    const normalized = link.name.trim().toLowerCase();
    const found = items.find(
      (item) => item.name.trim().toLowerCase() === normalized
    );

    if (found) {
      setEditing(found);
      setInitialName(undefined);
      setModalOpen(true);
      return;
    }

    setEditing(null);
    setInitialName(link.name);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 lg:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

        <button
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          onClick={() => {
            setEditing(null);
            setInitialName(undefined);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4"/>
          New
        </button>
      </div>

      <div className="w-full">
        <EntityList
          items={items}
          onEdit={(item) => {
            setEditing(item);
            setInitialName(undefined);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
          onInternalLinkClick={handleInternalLinkClick}
        />
      </div>

      <EntityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        entityName={title.slice(0, -1)}
        editing={editing}
        initialName={initialName}
        onSave={async (p) => {
          await handleSave(p);
          await load();
        }}
      />
    </div>
  );
}
