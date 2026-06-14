import * as projectsApi from "../../api/modules/projects";
import * as nodesApi from "../../api/modules/nodes";
import * as edgesApi from "../../api/modules/edges";
import {
  eventToCreatePayload,
  eventToUpdatePayload,
  nodeToEvent,
} from "../nodes/adapters";
import { resolveNodeTypeId } from "../nodes/nodeTypeResolver";
import { createCharacter, listCharacters, updateCharacter } from "../characters/api";
import { createLocation, listLocations, updateLocation } from "../locations/api";
import { createObject, listObjects, updateObject } from "../objects/api";
import type { Campaign, CampaignExport, EventItem } from "./types";

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

export async function duplicateCampaign(sourceId: string) {
  const [camp, events] = await Promise.all([
    getCampaign(sourceId),
    listCampaignEvents(sourceId),
  ]);

  const newCamp = await createCampaign({
    name: `${camp.name} (Copy)`,
    description: camp.description ?? null,
    imageUrl: (camp as any).imageUrl ?? null,
  });

  for (const ev of events) {
    await createCampaignEvent(newCamp.id, ev);
  }
  return newCamp;
}

export async function importCampaign(payload: CampaignExport) {
  const base = payload.campaign;

  const newCamp = await createCampaign({
    name: base?.name ? `${base.name} (Imported)` : "Imported campaign",
    description: base?.description ?? null,
    imageUrl: (base as any)?.imageUrl ?? null,
  });

  const newCampaignId = newCamp.id;

  // Characters
  for (const ch of payload.characters ?? []) {
    await createCharacter(newCampaignId, {
      name: ch.name,
      description: ch.description ?? null,
      imageUrl: ch.imageUrl ?? null,
    });
  }

  // Locations
  for (const loc of payload.locations ?? []) {
    await createLocation(newCampaignId, {
      name: loc.name,
      description: loc.description ?? null,
      imageUrl: loc.imageUrl ?? null,
    });
  }

  // Objects
  for (const obj of payload.objects ?? []) {
    await createObject(newCampaignId, {
      name: obj.name,
      description: obj.description ?? null,
      imageUrl: obj.imageUrl ?? null,
    });
  }

  // Events
  for (const ev of payload.events ?? []) {
    await createCampaignEvent(newCampaignId, {
      title: ev.title,
      description: ev.description ?? null,
      imageUrl: ev.imageUrl ?? null,
    });
  }

  try {
    const [events, characters, locations, objects] = await Promise.all([
      listCampaignEvents(newCampaignId),
      listCharacters(newCampaignId),
      listLocations(newCampaignId),
      listObjects(newCampaignId),
    ]);

    // Events
    await Promise.all(
      events.map((ev) =>
        updateEvent(ev.id, {
          title: ev.title,
          description: ev.description ?? null,
          imageUrl: (ev as any).imageUrl ?? null,
        })
      )
    );

    // Characters
    await Promise.all(
      characters.map((ch) =>
        updateCharacter(ch.id, {
          name: ch.name,
          description: ch.description ?? null,
          imageUrl: (ch as any).imageUrl ?? null,
        })
      )
    );

    // Locations
    await Promise.all(
      locations.map((loc) =>
        updateLocation(loc.id, {
          name: loc.name,
          description: loc.description ?? null,
          imageUrl: (loc as any).imageUrl ?? null,
        })
      )
    );

    // Objects
    await Promise.all(
      objects.map((obj) =>
        updateObject(obj.id, {
          name: obj.name,
          description: obj.description ?? null,
          imageUrl: (obj as any).imageUrl ?? null,
        })
      )
    );
  } catch {

  }

  return newCamp;
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
