import { useNavigate } from "react-router-dom";

type Props = {
  id: string;
  name: string;
  description?: string | null;
  eventsCount?: number;
  coverUrl?: string | null; // opcional, tenho que adicionar depois
  onManage?: (id: string) => void;
};

export default function CampaignCard({
  id,
  name,
  description,
  eventsCount,
  coverUrl,
  onManage,
}: Props) {
  const navigate = useNavigate();

  return (
    <li className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative h-32 w-full">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 dark:from-zinc-800 dark:via-zinc-900 dark:to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-zinc-900 shadow ring-1 ring-black/5 dark:bg-zinc-900/90 dark:text-zinc-100 dark:ring-white/10">
            {typeof eventsCount === "number" ? `${eventsCount} events` : "—"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-semibold tracking-tight">
          {name}
        </h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
            {description}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => navigate(`/campaigns/${id}/timeline`)}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
            type="button"
          >
            Open timeline
          </button>
          <button
            onClick={() => onManage?.(id)}
            className="inline-flex items-center rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300/60 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus:ring-zinc-600/50"
            type="button"
          >
            Manage
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 ring-0 ring-blue-500/0 transition group-hover:ring-2 group-hover:ring-blue-500/20" />
    </li>
  );
}
