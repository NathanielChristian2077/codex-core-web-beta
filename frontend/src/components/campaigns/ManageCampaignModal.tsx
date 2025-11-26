import { Copy, Image as ImageIcon, Save, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import {
  deleteCampaign,
  duplicateCampaign,
  getCampaign,
  listCampaignEvents,
  updateCampaign,
} from "../../features/campaigns/api";
import { CampaignExport } from "../../features/campaigns/types";
import { listCharacters } from "../../features/characters/api";
import { listLocations } from "../../features/locations/api";
import { listObjects } from "../../features/objects/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../animate-ui/components/radix/dialog";
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
        setCoverUrl((c as any).imageUrl ?? "");
      } catch {
        toast.show("Failed to load campaign", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, campaignId, toast]);

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
      const [camp, events, characters, locations, objects] = await Promise.all([
        getCampaign(campaignId),
        listCampaignEvents(campaignId),
        listCharacters(campaignId),
        listLocations(campaignId),
        listObjects(campaignId),
      ]);

      const payload: CampaignExport = {
        campaign: camp,
        events,
        characters,
        locations,
        objects,
      };

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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent from="bottom" className="sm:max-w-xl">
        <DialogHeader className="mb-3 flex flex-row items-center justify-between gap-2">
          <div>
            <DialogTitle>Manage campaign</DialogTitle>
            <DialogDescription>
              Update metadata, duplicate or export this campaign.
            </DialogDescription>
          </div>
        </DialogHeader>

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

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="inline-flex cursor-pointer items-center gap-2 rounded border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <Upload className="h-4 w-4" />
                  Export JSON
                </button>

                <button
                  type="button"
                  onClick={handleDuplicate}
                  disabled={dupLoading}
                  className="inline-flex cursor-pointer items-center gap-2 rounded border px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:opacity-70 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  <Copy className="h-4 w-4" />
                  {dupLoading ? "Duplicating..." : "Duplicate"}
                </button>
              </div>

              <div className="flex flex-col gap-2 sm:items-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex cursor-pointer items-center gap-2 rounded border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-70"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save changes"}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex cursor-pointer items-center gap-2 rounded border border-red-500 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
