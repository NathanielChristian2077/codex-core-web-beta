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
  onInternalLinkClick?: (link: InternalLink) => void; // 👈 novo
};

export default function EntityList({
  items,
  onEdit,
  onDelete,
  onInternalLinkClick,
}: Props) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <EntityRow
          key={item.id}
          name={item.name}
          description={item.description}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
          onInternalLinkClick={onInternalLinkClick} // 👈 repassa pro row
        />
      ))}
    </ul>
  );
}
