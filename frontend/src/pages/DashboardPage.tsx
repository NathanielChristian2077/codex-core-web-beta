import { useEffect, useRef, useState } from "react";
import CampaignCard from "../components/campaigns/CampaignCard";
import CreateCampaignModal from "../components/campaigns/CreateCampaignModal";
import EmptyState from "../components/campaigns/EmptyState";
import ManageCampaignModal from "../components/campaigns/ManageCampaignModal";
import Spinner from "../components/layout/Spinner";
import { useToast } from "../components/layout/ToastProvider";
import { createCampaign, importCampaign, listCampaigns } from "../features/campaigns/api";
import type { Campaign, CampaignExport } from "../features/campaigns/types";

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [manageId, setManageId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const t = useToast();

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
      await importCampaign(json);
      t.show("Campaign imported", "success");
      await fetchAll();
    } catch {
      t.show("Invalid JSON or import failed", "error");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  useEffect(() => { fetchAll(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Spinner size={24} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <div className="flex gap-2">
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
            className="rounded border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Import JSON
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            New campaign
          </button>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <CreateCampaignModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />

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
