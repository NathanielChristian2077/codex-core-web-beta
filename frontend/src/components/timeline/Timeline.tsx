import { AnimatePresence, motion } from "motion/react";
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
      <AnimatePresence>
        {sorted.map((ev, index) => (
          <motion.li
            key={ev.id}
            layout
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{
              duration: 0.18,
              delay: index * 0.03,
            }}
          >
            <EventRow
              event={ev}
              onEdit={onEdit}
              onDelete={onDelete}
              onInternalLinkClick={onInternalLinkClick}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
