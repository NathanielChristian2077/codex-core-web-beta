import * as projectsApi from "../../api/modules/projects";
import * as nodesApi from "../../api/modules/nodes";
import * as edgesApi from "../../api/modules/edges";
import {
  eventToCreatePayload,
  eventToUpdatePayload,
  nodeToEvent,
} from "../nodes/adapters";
import { resolveNodeTypeId } from "../nodes/nodeTypeResolver";
import type { ProjectExport } from "../../api/contracts/project";
import type { Campaign, EventItem } from "./types";

// Campaigns -> Projects.
// A UI ainda fala "Campaign", mas internamente isto usa a API nova /projects.
// Os nomes antigos continuam exportados como aliases para não quebrar telas.

export async function listProjects(): Promise<Campaign[]> {
  return projectsApi.listProjects() as Promise<Campaign[]>;
}

export async function getProject(id: string): Promise<Campaign> {
  return projectsApi.getProject(id) as Promise<Campaign>;
}

export async function createProject(payload: {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}): Promise<Campaign> {
  const project = await projectsApi.createProject({
    name: payload.name.trim(),
    description:
      payload.description !== undefined
        ? payload.description?.trim() || null
        : null,
    imageUrl:
      payload.imageUrl !== undefined ? payload.imageUrl?.trim() || null : null,
    // Semeia os NodeTypes/EdgeTypes (character/location/object/event/faction)
    // para a campanha já nascer utilizável no grafo e nas entidades.
    presetSlug: "rpg-campaign",
  });
  return project as Campaign;
}

export async function updateProject(
  id: string,
  payload: Partial<Campaign> & { imageUrl?: string | null }
): Promise<Campaign> {
  const project = await projectsApi.updateProject(id, {
    name: payload.name?.trim(),
    description:
      payload.description !== undefined
        ? payload.description?.trim() || null
        : undefined,
    imageUrl:
      payload.imageUrl !== undefined
        ? payload.imageUrl?.trim() || null
        : undefined,
  });
  return project as Campaign;
}

// Aliases temporários de compatibilidade (UI antiga).
export const listCampaigns = listProjects;
export const getCampaign = getProject;
export const createCampaign = createProject;
export const updateCampaign = updateProject;

// Duplicate/export/import são responsabilidade do backend (cópia profunda do
// grafo inteiro). O front só dispara o endpoint e trata loading/erro.
export async function duplicateCampaign(sourceId: string): Promise<Campaign> {
  return projectsApi.duplicateProject(sourceId) as Promise<Campaign>;
}

export async function exportCampaign(id: string): Promise<ProjectExport> {
  return projectsApi.exportProject(id);
}

export async function importCampaign(
  payload: ProjectExport
): Promise<Campaign> {
  return projectsApi.importProject(payload) as Promise<Campaign>;
}

export async function deleteProject(id: string) {
  await projectsApi.deleteProject(id);
}

export const deleteCampaign = deleteProject;

// Events -> Nodes (typeSlug "event").
const EVENT_SLUG = "event";

export async function listCampaignEvents(
  campaignId: string
): Promise<EventItem[]> {
  const nodes = await nodesApi.listNodes(campaignId, { typeSlug: EVENT_SLUG });
  return nodes.map(nodeToEvent);
}

export async function createCampaignEvent(
  campaignId: string,
  payload: {
    title: string;
    description?: string | null;
    imageUrl?: string | null;
  }
): Promise<EventItem> {
  const typeId = await resolveNodeTypeId(campaignId, EVENT_SLUG);
  const node = await nodesApi.createNode(
    campaignId,
    eventToCreatePayload(typeId, payload)
  );
  return nodeToEvent(node);
}

export async function updateEvent(
  eventId: string,
  payload: {
    title?: string;
    description?: string | null;
    imageUrl?: string | null;
  }
): Promise<EventItem> {
  const node = await nodesApi.updateNode(eventId, eventToUpdatePayload(payload));
  return nodeToEvent(node);
}

export async function deleteEvent(eventId: string) {
  await nodesApi.deleteNode(eventId);
}

// Grafo: formato novo do backend (nodes/edges genéricos com metadados de tipo).
export type { GraphResponse } from "../../api/contracts/edge";

export async function getCampaignGraph(campaignId: string) {
  return edgesApi.getGraph(campaignId);
}
