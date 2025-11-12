import { useEffect, useState } from "react";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../components/ui/ToastProvider";
import { createCampaignEvent, updateEvent } from "../../features/campaigns/api";
import type { EventItem } from "../../features/campaigns/types";

type Props = {
  open: boolean;
  onClose: () => void;
  campaignId: string;
  editing?: EventItem | null;
  onSaved?: () => void;
};

export default function EventModal({ open, onClose, campaignId, editing, onSaved }: Props) {
  const t = useToast();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [happenedIn, setHappenedIn] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(editing?.title ?? "");
    setDesc(editing?.desc ?? "");
    setOccurredAt((editing?.occurredAt ?? "").substring(0, 10));
    setHappenedIn(editing?.happenedIn ?? "");
  }, [open, editing]);

  if (!open) return null;

  async function handleSave() {
    if (!title.trim()) {
      t.show("Title is required", "error");
      return;
    }
    try {
      setSaving(true);
      if (editing?.id) {
        await updateEvent(editing.id, { title, desc, occurredAt, happenedIn });
        t.show("Event updated", "success");
      } else {
        await createCampaignEvent(campaignId, { title, desc, occurredAt, happenedIn });
        t.show("Event created", "success");
      }
      onSaved?.();
      onClose();
    } catch {
      t.show("Failed to save event", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-xl rounded-xl border bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{editing ? "Edit event" : "New event"}</h2>
          <button onClick={onClose} className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Close">✕</button>
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
            <span className="text-sm">Description (optional)</span>
            <textarea
              className="min-h-[96px] rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
            <label className="grid gap-1">
              <span className="text-sm">Date (optional)</span>
              <input
                type="date"
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
                value={occurredAt}
                onChange={(e) => setOccurredAt(e.target.value)}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Location (optional)</span>
              <input
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
                value={happenedIn}
                onChange={(e) => setHappenedIn(e.target.value)}
                placeholder="Neverwinter, Baldur's Gate…"
              />
            </label>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800" type="button">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-70" type="button">
            {saving ? <span className="inline-flex items-center"><Spinner />&nbsp;Saving…</span> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
