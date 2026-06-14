import { useParams } from "react-router-dom";
import EntityPage from "./_EntityPage";

export default function CharactersPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="p-4 text-sm text-red-500">
        No campaign selected.
      </div>
    );
  }

  return <EntityPage title="Characters" projectId={id} nodeTypeSlug="character" />;
}
