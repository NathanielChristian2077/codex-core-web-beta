// Wrapper de compatibilidade sobre a API genérica de Nodes (typeSlug "location").
import * as nodesApi from "../../api/modules/nodes";
import {
  entityToCreatePayload,
  entityToUpdatePayload,
  nodeToEntity,
} from "../nodes/adapters";
import { resolveNodeTypeId } from "../nodes/nodeTypeResolver";
import type { LocationEntity } from "./types";

const SLUG = "location";

type Payload = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
};

export const listLocations = (campaignId: string): Promise<LocationEntity[]> =>
  nodesApi
    .listNodes(campaignId, { typeSlug: SLUG })
    .then((nodes) => nodes.map(nodeToEntity));

export const createLocation = async (campaignId: string, p: Payload) => {
  const typeId = await resolveNodeTypeId(campaignId, SLUG);
  const node = await nodesApi.createNode(
    campaignId,
    entityToCreatePayload(typeId, p)
  );
  return nodeToEntity(node);
};

export const updateLocation = async (id: string, p: Payload) => {
  const node = await nodesApi.updateNode(id, entityToUpdatePayload(p));
  return nodeToEntity(node);
};

export const deleteLocation = (id: string) => nodesApi.deleteNode(id);
