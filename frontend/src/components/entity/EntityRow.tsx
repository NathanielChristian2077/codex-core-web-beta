type Props = {
  name: string;
  description?: string | null;
  onEdit: () => void;
  onDelete: () => void;
};

export default function EntityRow({ name, description, onEdit, onDelete }: Props) {
  return (
    <li className="rounded-lg border p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h4 className="text-sm font-semibold">{name}</h4>
      {description && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>}
      <div className="mt-3 flex gap-2">
        <button className="rounded border px-3 py-1 text-sm dark:border-zinc-700" onClick={onEdit}>
          Edit
        </button>
        <button
          className="rounded border border-red-500 px-3 py-1 text-sm text-red-600 dark:text-red-400"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
