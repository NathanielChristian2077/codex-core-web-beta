import { useParams } from "react-router-dom";
import EntityPage from "./_EntityPage";

export default function LocationsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="p-4 text-sm text-red-500">
        No campaign selected.
      </div>
    );
  }

  return <EntityPage title="Locations" projectId={id} nodeTypeSlug="location" />;
}
