import { useNavigate } from "react-router-dom";

type Props = {
  id: string;
  name: string;
  description?: string | null;
  eventsCount?: number;
  onManage?: (id: string) => void;
}

export default function CampaignCard({ id, name, description, eventsCount, onManage }: Props) {
  const navigate = useNavigate();

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
        <button
          onClick={() => navigate(`/campaigns/${id}/timeline`)}
          className="rounded border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800" type="button"
        >
          Open timeline
        </button>
        <button
          onClick={() => onManage?.(id)}
          className="rounded border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800" type="button"
        >
          Manage
        </button>
      </div>
    </li>
  );
}
