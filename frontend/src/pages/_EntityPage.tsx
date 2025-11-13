import { useEffect, useState } from "react";
import EntityList, { EntityBase } from "../components/entity/EntityList";
import EntityModal from "../components/entity/EntityModal";
import Spinner from "../components/ui/Spinner";
import { useToast } from "../components/ui/ToastProvider";

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

export default function EntityPage({
  title,
  campaignId,
  listFn,
  createFn,
  updateFn,
  deleteFn,
}: Props) {
  const t = useToast();

  const [items, setItems] = useState<EntityBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EntityBase | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => {
            setEditing(null);
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
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <EntityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        entityName={title.slice(0, -1)} // "Characters" → "Character"
        editing={editing}
        onSave={async (p) => {
          await handleSave(p);
          await load();
        }}
      />
    </div>
  );
}
