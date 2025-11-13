import { useParams } from "react-router-dom";
import {
  createObject,
  deleteObject,
  listObjects,
  updateObject,
} from "../features/objects/api";
import EntityPage from "./_EntityPage";

export default function ObjectsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="p-4 text-sm text-red-500">
        No campaign selected.
      </div>
    );
  }

  return (
    <EntityPage
      title="Objects"
      campaignId={id}
      listFn={listObjects}
      createFn={createObject}
      updateFn={updateObject}
      deleteFn={deleteObject}
    />
  );
}
