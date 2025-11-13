import type { EventItem } from "../../features/campaigns/types";
import EventRow from "./EventRow";

type Props = {
  events: EventItem[];
  onEdit: (ev: EventItem) => void;
  onDelete: (id: string) => void;
};

export default function Timeline({ events, onEdit, onDelete }: Props) {
  const sorted = [...events].sort((a, b) => {
    const da = a.createdAt ? Date.parse(a.createdAt) : Infinity;
    const db = b.createdAt ? Date.parse(b.createdAt) : Infinity;
    return da - db;
  });

  return (
    <ul className="space-y-2">
      {sorted.map((ev) => (
        <EventRow key={ev.id} event={ev} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
}
