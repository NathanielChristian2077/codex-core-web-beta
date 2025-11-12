import type { EventItem } from "../../features/campaigns/types";
import { formatDate } from "./formatDate";

type Props = {
  event: EventItem;
  onEdit: (ev: EventItem) => void;
  onDelete: (id: string) => void;
};

export default function EventRow({ event, onEdit, onDelete }: Props) {
  return (
    <li className="group relative rounded-lg border border-zinc-200 bg-white/70 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {formatDate(event.occurredAt)}
          </div>
          <h4 className="line-clamp-1 text-sm font-semibold">{event.title}</h4>
          {event.desc && (
            <p className="mt-0.5 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
              {event.desc}
            </p>
          )}
          {event.happenedIn && (
            <p className="mt-0.5 text-xs text-zinc-500">at {event.happenedIn}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => onEdit(event)}
            className="rounded border px-2 py-1 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="rounded border border-red-500 px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
