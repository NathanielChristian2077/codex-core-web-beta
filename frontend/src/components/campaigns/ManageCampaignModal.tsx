import { useState, useEffect } from "react";
import api from "../../lib/apiClient";

type Props = {
  open: boolean;
  onClose: () => void;
  campaignId?: string;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

export default function ManageCampaignModal({ open, onClose, campaignId, onUpdated, onDeleted }: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!campaignId) {
      return;
    }
    (async () => {
      try {
        const res = await api.get(`/campaigns/${campaignId}`);
        setName(res.data.name);
        setDesc(res.data.desc ?? "");
      } catch {
        console.warn("Failed to load campaign data");
      }
    })();
  }, [campaignId]);

  if (!open) return null;

  async function handleSave() {
    if (!campaignId) {
      return;
    }
    setLoading(true);
    try {
      await api.put(`/campaigns/${campaignId}`, {
        name: name.trim(),
        desc: desc.trim() || null,
      });
      onUpdated?.();
      onClose();
    } catch {
      alert("Failed to update campaign");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!campaignId) return;
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await api.delete(`/campaigns/${campaignId}`);
      onDeleted?.();
      onClose();
    } catch {
      alert("Failed to delete campaign");
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-xl border bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Manage campaign</h2>
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
              placeholder="e.g. Crows of Vesteria"
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
          <button onClick={handleDelete} className="rounded border border-red-500 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20" type="button">
            Delete
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded border px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              Cancel
            </button>
            <button disabled={loading} onClick={handleSave} className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-70">
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
