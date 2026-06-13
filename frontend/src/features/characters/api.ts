// Wrapper de compatibilidade: a UI ainda fala "Character", mas internamente
// isto usa a API genérica de Nodes (typeSlug "character").
import * as nodesApi from "../../api/modules/nodes";
import {
  entityToCreatePayload,
  entityToUpdatePayload,
  nodeToEntity,
} from "../nodes/adapters";
import { resolveNodeTypeId } from "../nodes/nodeTypeResolver";
import type { Character } from "./types";

const SLUG = "character";

type Payload = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
};

export const listCharacters = (campaignId: string): Promise<Character[]> =>
  nodesApi
    .listNodes(campaignId, { typeSlug: SLUG })
    .then((nodes) => nodes.map(nodeToEntity));

export const createCharacter = async (campaignId: string, p: Payload) => {
  const typeId = await resolveNodeTypeId(campaignId, SLUG);
  const node = await nodesApi.createNode(
    campaignId,
    entityToCreatePayload(typeId, p)
  );
  return nodeToEntity(node);
};

export const updateCharacter = async (id: string, p: Payload) => {
  const node = await nodesApi.updateNode(id, entityToUpdatePayload(p));
  return nodeToEntity(node);
};

export const deleteCharacter = (id: string) => nodesApi.deleteNode(id);
