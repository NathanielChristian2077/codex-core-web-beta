import { Image as ImageIcon, Save } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../animate-ui/components/radix/dialog";
import Spinner from "../layout/Spinner";
import { useToast } from "../layout/ToastProvider";
import { MarkdownEditor } from "../markdown/MarkdownEditor";

type EditingEntity = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  entityName: string; // "Character"
  editing?: EditingEntity | null;
  onSave: (payload: {
    name: string;
    description?: string | null;
    imageUrl?: string | null;
  }) => Promise<void>;
  initialName?: string;
};

export default function EntityModal({
  open,
  onClose,
  entityName,
  editing,
  onSave,
  initialName,
}: Props) {
  const t = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(editing?.name ?? initialName ?? "");
    setDescription(editing?.description ?? "");
    setImageUrl(editing?.imageUrl ?? "");
  }, [open, editing, initialName]);

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
        imageUrl: imageUrl.trim() ? imageUrl.trim() : null,
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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent from="bottom" className="sm:max-w-xl">
        <DialogHeader className="mb-3 flex flex-row items-center justify-between gap-2">
          <div>
            <DialogTitle>
              {editing ? `Edit ${entityName}` : `New ${entityName}`}
            </DialogTitle>
            <DialogDescription>
              Manage the details of this {entityName.toLowerCase()}.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Name</span>
            <input
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
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

          <label className="grid gap-1">
            <span className="flex items-center gap-2 text-sm">
              <ImageIcon className="h-4 w-4 text-zinc-500" />
              Image URL (optional)
            </span>
            <input
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="https://…"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </label>
        </div>

        <DialogFooter className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <span className="inline-flex items-center gap-2">
              Cancel
            </span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex cursor-pointer items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Spinner size={16} />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
