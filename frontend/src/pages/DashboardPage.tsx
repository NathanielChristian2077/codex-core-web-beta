import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import api from "../lib/apiClient"

type Campanha = {
  id: string;
  nome: string;
  descricao?: string | null;
  _count?: { eventos: number };
};

type CampaignCardProps = { name: string, description?: string, eventsCount?: number };

function CampaignCard({ name, description, eventsCount }: CampaignCardProps) {
  return (
    <li className="group relative rounded-x1 border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow dark:border-zinc-800 dark:border-zinc-900">
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold tracking-tight">{name}</h3>
        <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {typeof eventsCount === "number" ? `${eventsCount} events` : "-"}
        </span>
      </div>
      {description && (
        <p className="mt-2 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-300">
          {description}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2">
        <button className="rounded border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800" type="button">
          Open timeline
        </button>
        <button className="rounded border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800" type="button">
          Manage
        </button>
      </div>
    </li>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-x1 border border-dashed p-10 text-center dark:border-zinc-800">
      <h3 className="text-lg font-semibold">No campaigns yet</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        Create your first campaign to start adding events, characters, locations and objects.
      </p>
      <button onClick={onCreate} className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" type="button">
        Create campaign
      </button>
    </div>
  );
}

function CreateCampaignModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  if (!open) return null

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
          <button onClick={onClose} className="rounded border px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800" type="button">
            Cancel
          </button>
          <button className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700" type="button">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loadCampanhas() {
    try {
      setLoading(true);
      const res = await api.get<Campanha[]>("/campaigns");
      setCampanhas(res.data);
      setError("");
    } catch (err: unknown) {
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
    } catch (err: unknown) {
      setError("Failed to create campaign");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await api.delete(`/campaigns/${id}`);
      await loadCampanhas();
    } catch (err: unknown) {
      setError("Failed to delete campaign");
    }
  }

  useEffect(() => {
    loadCampanhas();
  }, []);

  //Demo
  const mockCampaigns = useMemo<CampaignCardProps[]>(
    () => [
      { name: "Demo campaign", description: "Seeded campaign to demonstrate timeline and graph.", eventsCount: 2 },
      { name: "Ravenfall", description: "Dark alleys, missing amulets, and a suspicious tavern.", eventsCount: 7 },
      { name: "Untitled", description: "Fresh start. No events yet.", eventsCount: 0 },
    ],
    []
  );

  const hasCampaigns = mockCampaigns.length > 0;

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">My Campaigns</h1>
        <div className="flex items-center gap-2">
          <input placeholder="Search campaigns..." className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900 sm:w-64" />
          <button onClick={() => setIsCreateOpen(true)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" type="button">
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

      {/*TODO: ...*/}

      {hasCampaigns ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockCampaigns.map((c) => (
            <CampaignCard key={c.name} name={c.name} description={c.description} eventsCount={c.eventsCount} />
          ))}
        </ul>
      ) : (
        <EmptyState onCreate={() => setIsCreateOpen(true)} />
      )}

      <CreateCampaignModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </AppShell>
  )
}
