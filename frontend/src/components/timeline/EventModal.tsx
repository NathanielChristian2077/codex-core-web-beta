import { useEffect, useState } from "react";
import { MarkdownEditor } from "../../components/markdown/MarkdownEditor";
import {
    createCampaignEvent,
    updateEvent,
} from "../../features/campaigns/api";
import type { EventItem } from "../../features/campaigns/types";
import Spinner from "../layout/Spinner";
import { useToast } from "../layout/ToastProvider";

type Props = {
  open: boolean;
  onClose: () => void;
  campaignId: string;
  editing?: EventItem | null;
  onSaved?: () => void;
  onCreated?: (event: EventItem) => void;
  initialTitle?: string;
};

export default function EventModal({
  open,
  onClose,
  campaignId,
  editing,
  onSaved,
  onCreated,
  initialTitle,
}: Props) {
  const t = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setTitle(editing?.title ?? initialTitle ?? "");
    setDescription(editing?.description ?? "");
    setImageUrl(editing?.imageUrl ?? "");
  }, [open, editing, initialTitle]);

  if (!open) return null;

  async function handleSave() {
    if (!title.trim()) {
      t.show("Title is required", "error");
      return;
    }

    const normalizedImageUrl = imageUrl.trim() || undefined;

    try {
      setSaving(true);

      if (editing?.id) {
        await updateEvent(editing.id, {
          title,
          description,
          imageUrl: normalizedImageUrl,
        });
        t.show("Event updated", "success");
        onSaved?.();
      } else {
        const created = await createCampaignEvent(campaignId, {
          title,
          description,
          imageUrl: normalizedImageUrl,
        });
        t.show("Event created", "success");
        onSaved?.();
        onCreated?.(created);
      }

      onClose();
    } catch {
      t.show("Failed to save event", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-xl border bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {editing ? "Edit event" : "New event"}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Title</span>
            <input
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Image URL (optional)</span>
            <input
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/event-cover.jpg"
            />
          </label>

          <div className="grid gap-1">
            <MarkdownEditor
              value={description}
              onChange={setDescription}
              label="Description"
              placeholder="Event description with markdown and internal links..."
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Use tokens like{" "}
              <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">
                &lt;&lt;C:Name&gt;&gt;
              </code>
              ,{" "}
              <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">
                &lt;&lt;L:Location&gt;&gt;
              </code>
              ,{" "}
              <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">
                &lt;&lt;O:Object&gt;&gt;
              </code>{" "}
              or{" "}
              <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">
                &lt;&lt;E:Event title&gt;&gt;
              </code>{" "}
              to create links between entities.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded border px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-70"
            type="button"
          >
            {saving ? (
              <span className="inline-flex items-center gap-1">
                <Spinner size={16} /> Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
