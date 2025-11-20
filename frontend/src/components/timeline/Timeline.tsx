import type { EventItem } from "../../features/campaigns/types";
import type { InternalLink } from "../../lib/internalLinks";
import EventRow from "./EventRow";

type Props = {
  events: EventItem[];
  onEdit: (ev: EventItem) => void;
  onDelete: (id: string) => void;
  onInternalLinkClick?: (link: InternalLink) => void;
};

export default function Timeline({
  events,
  onEdit,
  onDelete,
  onInternalLinkClick,
}: Props) {
  const sorted = [...events].sort((a, b) => {
    const da = a.createdAt ? Date.parse(a.createdAt) : Infinity;
    const db = b.createdAt ? Date.parse(b.createdAt) : Infinity;
    return da - db;
  });

  return (
    <ul className="space-y-2">
      {sorted.map((ev) => (
        <EventRow
          key={ev.id}
          event={ev}
          onEdit={onEdit}
          onDelete={onDelete}
          onInternalLinkClick={onInternalLinkClick}
        />
      ))}
    </ul>
  );
}
