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
};

export default function EntityList({ items, onEdit, onDelete }: Props) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <EntityRow
          key={item.id}
          name={item.name}
          description={item.description}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </ul>
  );
}
