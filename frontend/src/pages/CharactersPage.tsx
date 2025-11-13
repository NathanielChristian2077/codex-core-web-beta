import { useParams } from "react-router-dom";
import {
  createCharacter,
  deleteCharacter,
  listCharacters,
  updateCharacter,
} from "../features/characters/api";
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

  return (
    <EntityPage
      title="Characters"
      campaignId={id}
      listFn={listCharacters}
      createFn={createCharacter}
      updateFn={updateCharacter}
      deleteFn={deleteCharacter}
    />
  );
}
