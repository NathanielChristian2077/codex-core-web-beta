import { AnimatePresence, motion } from "motion/react";
import type { InternalLink } from "../../lib/internalLinks";
import EntityRow from "./EntityRow";

export type EntityBase = {
  id: string;
  name: string;
  description?: string | null;
};

type Props = {
  items: EntityBase[];
  onEdit: (item: EntityBase) => void;
  onDelete: (id: string) => void;
  onInternalLinkClick?: (link: InternalLink) => void;
};

export default function EntityList({
  items,
  onEdit,
  onDelete,
  onInternalLinkClick,
}: Props) {
  return (
    <ul className="w-full space-y-4">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.li
            key={item.id}
            layout
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{
              duration: 0.18,
              delay: index * 0.03,
            }}
          >
            <EntityRow
              name={item.name}
              description={item.description}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
              onInternalLinkClick={onInternalLinkClick}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
