export default function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-x1 border border-dashed p-10 text-center dark:border-zinc-800">
      <h3 className="text-lg font-semibold">No campaigns yet</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        Create your first campaign to start adding events, characters, locations and objects.
      </p>
      <button onClick={onCreate} className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" type="button">
        Create campaign
      </button>
    </div>
  );
}
