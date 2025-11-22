import { useEffect, useState } from "react";
import {
    deleteCampaign,
    duplicateCampaign,
    getCampaign,
    updateCampaign,
} from "../../features/campaigns/api";
import Spinner from "../layout/Spinner";
import { useToast } from "../layout/ToastProvider";
import { MarkdownEditor } from "../markdown/MarkdownEditor";

type Props = {
  open: boolean;
  onClose: () => void;
  campaignId?: string;
  onUpdated?: () => void;
  onDeleted?: () => void;
};

export default function ManageCampaignModal({
  open,
  onClose,
  campaignId,
  onUpdated,
  onDeleted,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dupLoading, setDupLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!open || !campaignId) return;
    setLoading(true);
    (async () => {
      try {
        const c = await getCampaign(campaignId);
        setName(c.name);
        setDescription(c.description ?? "");
        // imageUrl may or may not exist in the type depending on your definitions
        setCoverUrl((c as any).imageUrl ?? "");
      } catch {
        toast.show("Failed to load campaign", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, campaignId, toast]);

  if (!open) return null;

  async function handleSave() {
    if (!campaignId) return;
    try {
      setSaving(true);
      await updateCampaign(campaignId, {
        name: name.trim(),
        description: description.trim() || null,
        imageUrl: coverUrl.trim() ? coverUrl.trim() : null,
      } as any);
      toast.show("Campaign updated", "success");
      onUpdated?.();
      onClose();
    } catch {
      toast.show("Failed to update campaign", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!campaignId) return;
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteCampaign(campaignId);
      toast.show("Campaign deleted", "success");
      onDeleted?.();
      onClose();
    } catch {
      toast.show("Failed to delete campaign", "error");
    }
  }

  async function handleDuplicate() {
    if (!campaignId) return;
    try {
      setDupLoading(true);
      await duplicateCampaign(campaignId);
      toast.show("Campaign duplicated", "success");
      onUpdated?.();
      onClose();
    } catch {
      toast.show("Failed to duplicate", "error");
    } finally {
      setDupLoading(false);
    }
  }

  async function handleExportJSON() {
    if (!campaignId) return;
    try {
      const camp = await getCampaign(campaignId);
      const events = await (
        await import("../../features/campaigns/api")
      ).listCampaignEvents(campaignId);
      const payload = { campaign: camp, events };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `campaign-${campaignId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.show("Exported as JSON", "success");
    } catch {
      toast.show("Failed to export", "error");
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
          <h2 className="text-lg font-semibold">Manage campaign</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <Spinner /> Loading...
          </div>
        ) : (
          <>
            <div className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm">Name</span>
                <input
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <MarkdownEditor
                value={description}
                onChange={setDescription}
                label="Description"
                placeholder="Campaign description (markdown supported)"
              />

              <label className="grid gap-1">
                <span className="text-sm">Cover image URL (optional)</span>
                <input
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
                  placeholder="https://…"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                />
              </label>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handleExportJSON}
                  className="rounded border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  type="button"
                >
                  Export JSON
                </button>
                <button
                  onClick={handleDuplicate}
                  disabled={dupLoading}
                  className="rounded border px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:opacity-70 dark:hover:bg-zinc-800"
                  type="button"
                >
                  {dupLoading ? "Duplicating..." : "Duplicate"}
                </button>
              </div>

              <div className="flex gap-2">
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
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded border border-red-500 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
