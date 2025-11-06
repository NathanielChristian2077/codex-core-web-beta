import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, desc: string) => Promise<void> | void;
}

export default function CreateCampaignModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);
  if (!open) return null

  async function submit() {
    if (!name.trim()) return;
    setSaving(true);
    await onCreate(name, desc);
    setSaving(false);
    setName("");
    setDesc("");
  }  

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-xl border bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create campaign</h2>
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
            <span className="text-sm">Name</span>
            <input
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="e.g. Two Towers"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Description</span>
            <textarea
              className="min-h-[96px] rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Optional short pitch about the campaign"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded border px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800" type="button">
            Cancel
          </button>
          <button onClick={ submit } disabled={ saving || !name.trim()} className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700" type="button">
            {saving ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
