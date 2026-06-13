// Wrapper de compatibilidade sobre a API genérica de Nodes (typeSlug "object").
import * as nodesApi from "../../api/modules/nodes";
import {
  entityToCreatePayload,
  entityToUpdatePayload,
  nodeToEntity,
} from "../nodes/adapters";
import { resolveNodeTypeId } from "../nodes/nodeTypeResolver";
import type { ObjectEntity } from "./types";

const SLUG = "object";

type Payload = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
};

export const listObjects = (campaignId: string): Promise<ObjectEntity[]> =>
  nodesApi
    .listNodes(campaignId, { typeSlug: SLUG })
    .then((nodes) => nodes.map(nodeToEntity));

export const createObject = async (campaignId: string, p: Payload) => {
  const typeId = await resolveNodeTypeId(campaignId, SLUG);
  const node = await nodesApi.createNode(
    campaignId,
    entityToCreatePayload(typeId, p)
  );
  return nodeToEntity(node);
};

export const updateObject = async (id: string, p: Payload) => {
  const node = await nodesApi.updateNode(id, entityToUpdatePayload(p));
  return nodeToEntity(node);
};

export const deleteObject = (id: string) => nodesApi.deleteNode(id);
