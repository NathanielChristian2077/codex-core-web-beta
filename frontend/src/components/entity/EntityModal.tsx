import { useEffect, useState } from "react";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../components/ui/ToastProvider";
import { MarkdownEditor } from "../markdown/MarkdownEditor";

type Props = {
  open: boolean;
  onClose: () => void;

  entityName: string; // "Character"
  editing?: { id: string; name: string; description?: string | null } | null;

  onSave: (payload: { name: string; description?: string | null }) => Promise<void>;
};

export default function EntityModal({
  open,
  onClose,
  entityName,
  editing,
  onSave,
}: Props) {
  const t = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(editing?.name ?? "");
    setDescription(editing?.description ?? "");
  }, [open, editing]);

  if (!open) return null;

  async function handleSave() {
    if (!name.trim()) {
      t.show("Name is required", "error");
      return;
    }
    try {
      setSaving(true);
      await onSave({
        name: name.trim(),
        description: description.trim() || null,
      });
      t.show(`${entityName} saved`, "success");
      onClose();
    } catch {
      t.show(`Failed to save ${entityName.toLowerCase()}`, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl border bg-white p-6 shadow-xl dark:bg-zinc-900 dark:border-zinc-800">
        <h2 className="mb-4 text-lg font-semibold">
          {editing ? `Edit ${entityName}` : `New ${entityName}`}
        </h2>

        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Name</span>
            <input
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 dark:bg-zinc-900 dark:border-zinc-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <MarkdownEditor
            value={description}
            onChange={setDescription}
            label="Description"
            placeholder={`Describe this ${entityName.toLowerCase()} using markdown...`}
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border px-3 py-1.5">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {saving ? <Spinner size={16} /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
