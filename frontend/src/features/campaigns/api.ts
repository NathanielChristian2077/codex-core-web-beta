import api from "../../lib/apiClient";
import { createCharacter } from "../characters/api";
import { createLocation } from "../locations/api";
import { createObject } from "../objects/api";
import type { Campaign, CampaignExport, EventItem } from "./types";

// Campaigns
export async function listCampaigns(): Promise<Campaign[]> {
  const { data } = await api.get("/campaigns");
  return data;
}

export async function getCampaign(id: string): Promise<Campaign> {
  const { data } = await api.get(`/campaigns/${id}`);
  return data;
}

export async function createCampaign(payload: {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
}) {
  const { data } = await api.post("/campaigns", {
    name: payload.name.trim(),
    description:
      payload.description !== undefined
        ? payload.description?.trim() || null
        : null,
    imageUrl:
      payload.imageUrl !== undefined ? payload.imageUrl?.trim() || null : null,
  });
  return data as Campaign;
}

export async function updateCampaign(
  id: string,
  payload: Partial<Campaign> & { imageUrl?: string | null }
) {
  const { data } = await api.put(`/campaigns/${id}`, {
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
  return data as Campaign;
}

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

  return newCamp;
}

export async function deleteCampaign(id: string) {
  await api.delete(`/campaigns/${id}`);
}

// Events
export async function listCampaignEvents(
  campaignId: string
): Promise<EventItem[]> {
  const { data } = await api.get(`/campaigns/${campaignId}/events`);
  return data;
}

export async function createCampaignEvent(
  campaignId: string,
  payload: {
    title: string;
    description?: string | null;
    imageUrl?: string | null;
  }
) {
  const body = {
    title: payload.title.trim(),
    description:
      payload.description !== undefined
        ? payload.description?.trim() || null
        : null,
    imageUrl:
      payload.imageUrl !== undefined ? payload.imageUrl?.trim() || null : null,
  };

  const { data } = await api.post(`/campaigns/${campaignId}/events`, body);
  return data as EventItem;
}

export async function updateEvent(
  eventId: string,
  payload: {
    title?: string;
    description?: string | null;
    imageUrl?: string | null;
  }
) {
  const body = {
    title: payload.title?.trim(),
    description:
      payload.description !== undefined
        ? payload.description?.trim() || null
        : undefined,
    imageUrl:
      payload.imageUrl !== undefined
        ? payload.imageUrl?.trim() || null
        : undefined,
  };

  const { data } = await api.put(`/events/${eventId}`, body);
  return data as EventItem;
}

export async function deleteEvent(eventId: string) {
  await api.delete(`/events/${eventId}`);
}

export type GraphNodeDto = {
  id: string;
  label: string;
  type: "EVENT" | "CHARACTER" | "LOCATION" | "OBJECT";
  description?: string | null;
};

export type GraphEdgeDto = {
  id: string;
  from: {
    id: string;
    type: "EVENT" | "CHARACTER" | "LOCATION" | "OBJECT";
  };
  to: {
    id: string;
    type: "EVENT" | "CHARACTER" | "LOCATION" | "OBJECT";
  };
  kind: string;
};

export type CampaignGraphResponse = {
  nodes: GraphNodeDto[];
  edges: GraphEdgeDto[];
};

export async function getCampaignGraph(
  campaignId: string
): Promise<CampaignGraphResponse> {
  const res = await api.get<CampaignGraphResponse>(
    `/campaigns/${campaignId}/graph`
  );
  return res.data;
}
