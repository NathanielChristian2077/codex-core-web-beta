import { Image as ImageIcon, PlusCircle } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../animate-ui/components/radix/dialog";
import { MarkdownEditor } from "../markdown/MarkdownEditor";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (
    name: string,
    description: string,
    imageUrl?: string | null
  ) => Promise<void> | void;
};

export default function CreateCampaignModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");

  async function submit() {
    if (!name.trim() || saving) return;
    setSaving(true);
    await onCreate(
      name,
      description,
      coverUrl.trim() ? coverUrl.trim() : null
    );
    setSaving(false);
    setName("");
    setDescription("");
    setCoverUrl("");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent from="bottom" className="sm:max-w-lg">
        <DialogHeader className="mb-2 flex flex-row items-center justify-between gap-2">
          <div>
            <DialogTitle>Create campaign</DialogTitle>
            <DialogDescription>
              Set up a new campaign with a name, description and optional cover.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid gap-3 pt-1">
          <label className="grid gap-1">
            <span className="text-sm">Name</span>
            <input
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="e.g. Two Towers"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <MarkdownEditor
            value={description}
            onChange={setDescription}
            label="Description"
            placeholder="Optional short pitch about the campaign (markdown supported)"
          />

          <label className="grid gap-1">
            <span className="flex items-center gap-2 text-sm">
              <ImageIcon className="h-4 w-4 text-zinc-500" />
              Cover image URL (optional)
            </span>
            <input
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="https://…"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
            />
          </label>
        </div>

        <DialogFooter className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving || !name.trim()}
            className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
          >
            <PlusCircle className="h-4 w-4" />
            {saving ? "Creating..." : "Create"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
