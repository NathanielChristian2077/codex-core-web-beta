import { useState, useEffect } from "react";
import AppShell from "../components/AppShell";
import api from "../lib/apiClient";
import CampaignCard from "../components/campaigns/CampaignCard";
import EmptyState from "../components/campaigns/EmptyState";
import CreateCampaignModal from "../components/campaigns/CreateCampaignModal";
import ManageCampaignModal from "../components/campaigns/ManageCampaignModal";

type Campaign = {
  id: string;
  name: string;
  desc?: string | null;
  _count?: { eventos: number };
};

export default function DashboardPage() {
  const [campanhas, setCampanhas] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [manageId, setManageId] = useState<string | null>(null);

  async function loadCampanhas() {
    try {
      setLoading(true);
      const res = await api.get<Campaign[]>("/campaigns");
      setCampanhas(res.data);
      setError("");
    } catch {
      setError("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(name: string, description: string) {
    try {
      await api.post("/campaigns", {
        name: name.trim(),
        description: description.trim() || null,
      });
      setIsCreateOpen(false);
      await loadCampanhas();
    } catch {
      setError("Failed to create campaign");
    }
  }


  useEffect(() => {
    loadCampanhas();
  }, []);

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">My Campaigns</h1>
        <div className="flex items-center gap-2">
          <input placeholder="Search campaigns..." className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900 sm:w-64" />
          <button onClick={() => setIsCreateOpen(true)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Create campaign
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading campaigns...</p>
      )}

      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {!loading && campanhas.length === 0 && (
        <EmptyState onCreate={() => setIsCreateOpen(true)} />
      )}

      {!loading && campanhas.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campanhas.map((c) => (
            <CampaignCard key={c.id} id={c.id} name={c.name} description={c.desc} eventsCount={c._count?.eventos} onManage={setManageId} />
          ))}
        </ul>
      )}

      <CreateCampaignModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={handleCreate} />
      <ManageCampaignModal open={!!manageId} campaignId={manageId ?? undefined} onClose={() => setManageId(null)} onUpdated={loadCampanhas} onDeleted={loadCampanhas} />
    </AppShell>
  )
}
