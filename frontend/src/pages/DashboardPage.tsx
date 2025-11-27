import { Download, PlusCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import CampaignCard from "../components/campaigns/CampaignCard";
import CreateCampaignModal from "../components/campaigns/CreateCampaignModal";
import EmptyState from "../components/campaigns/EmptyState";
import ManageCampaignModal from "../components/campaigns/ManageCampaignModal";
import Spinner from "../components/layout/Spinner";
import { useToast } from "../components/layout/ToastProvider";
import {
  createCampaign,
  importCampaign,
  listCampaigns,
} from "../features/campaigns/api";
import type { Campaign, CampaignExport } from "../features/campaigns/types";
import { useCurrentCampaign } from "../store/useCurrentCampaign";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [manageId, setManageId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const t = useToast();

  const { setCurrentCampaign } = useCurrentCampaign();

  async function fetchAll() {
    try {
      setLoading(true);
      const data = await listCampaigns();
      setCampaigns(data);
    } catch {
      t.show("Failed to load campaigns", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(name: string, description: string) {
    try {
      await createCampaign({ name, description: description?.trim() || null });
      t.show("Campaign created", "success");
      await fetchAll();
    } catch {
      t.show("Failed to create campaign", "error");
    } finally {
      setCreateOpen(false);
    }
  }

  async function handleImportFile(file: File) {
    try {
      const text = await file.text();
      const json = JSON.parse(text) as CampaignExport;

      const imported = await importCampaign(json);

      await fetchAll();

      if (imported?.id) {
        setCurrentCampaign(imported.id);
        navigate(`/campaigns/${imported.id}/timeline`);
      }

      t.show("Campaign imported", "success");
    } catch {
      t.show("Invalid JSON or import failed", "error");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-6 lg:px-6">
      {/* HEADER */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Campaigns</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage your worlds, timelines and stories in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportFile(f);
            }}
          />

          <button
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-zinc-300 px-3.5 py-2 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-300/70 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:focus:ring-zinc-600/60"
            type="button"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Import JSON</span>
            <span className="sm:hidden">Import</span>
          </button>

          <button
            onClick={() => setCreateOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/60 active:scale-[0.98]"
            type="button"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New campaign</span>
          </button>
        </div>
      </div>

      {/* GRID / EMPTY STATE */}
      {campaigns.length === 0 ? (
        <EmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard
              key={c.id}
              id={c.id}
              name={c.name}
              description={c.description ?? undefined}
              eventsCount={c._count?.events}
              coverUrl={c.imageUrl ?? undefined}
              onManage={setManageId}
            />
          ))}
        </ul>
      )}

      {/* MODALS */}
      <CreateCampaignModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />

      <ManageCampaignModal
        open={!!manageId}
        campaignId={manageId ?? undefined}
        onClose={() => setManageId(null)}
        onUpdated={fetchAll}
        onDeleted={fetchAll}
      />
    </div>
  );
}
