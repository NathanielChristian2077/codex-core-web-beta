import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EntityList, { EntityBase } from "../components/entity/EntityList";
import EntityModal from "../components/entity/EntityModal";
import Spinner from "../components/layout/Spinner";
import { useToast } from "../components/layout/ToastProvider";
import type { InternalLink } from "../lib/internalLinks";

type EntityPayload = {
  name: string;
  description?: string | null;
};

type Props = {
  title: string;
  campaignId: string;

  listFn: (campaignId: string) => Promise<EntityBase[]>;
  createFn: (campaignId: string, p: EntityPayload) => Promise<any>;
  updateFn: (id: string, p: EntityPayload) => Promise<any>;
  deleteFn: (id: string) => Promise<any>;
};

function inferKindFromTitle(title: string): "C" | "L" | "O" | null {
  const t = title.toLowerCase();
  if (t.startsWith("character")) return "C";
  if (t.startsWith("location")) return "L";
  if (t.startsWith("object")) return "O";
  return null;
}

function pathForKind(kind: "E" | "C" | "L" | "O", campaignId: string): string {
  switch (kind) {
    case "E":
      return `/campaigns/${campaignId}/timeline`;
    case "C":
      return `/campaigns/${campaignId}/characters`;
    case "L":
      return `/campaigns/${campaignId}/locations`;
    case "O":
      return `/campaigns/${campaignId}/objects`;
  }
}

export default function EntityPage({
  title,
  campaignId,
  listFn,
  createFn,
  updateFn,
  deleteFn,
}: Props) {
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
      const data = await listFn(campaignId);
      setItems(data);
    } catch {
      t.show("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [campaignId]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteFn(id);
      t.show("Deleted", "success");
      load();
    } catch {
      t.show("Failed to delete", "error");
    }
  }

  async function handleSave(payload: EntityPayload) {
    if (editing) {
      await updateFn(editing.id, payload);
    } else {
      await createFn(campaignId, payload);
    }
  }

  const handleInternalLinkClick = (link: InternalLink) => {
    const pageKind = inferKindFromTitle(title);
    if (!pageKind) return;

    if (link.kind !== pageKind) {
      const path = pathForKind(link.kind, campaignId);
      navigate(path);
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
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => {
            setEditing(null);
            setInitialName(undefined);
            setModalOpen(true);
          }}
        >
          New
        </button>
      </div>

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
