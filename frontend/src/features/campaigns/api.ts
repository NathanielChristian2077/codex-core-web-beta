import api from "../../lib/apiClient";
import type { Campaign, CampaignExport, EventItem } from "./types";

export async function listCampaigns(): Promise<Campaign[]> {
  const { data } = await api.get("/campaigns");
  return data;
}

export async function getCampaign(id: string): Promise<Campaign> {
  const { data } = await api.get(`/campaigns/${id}`);
  return data;
}

export async function createCampaign(payload: { name: string; description?: string | null }) {
  const { data } = await api.post("/campaigns", payload);
  return data as Campaign;
}

export async function updateCampaign(id: string, payload: Partial<Campaign>) {
  const { data } = await api.put(`/campaigns/${id}`, payload);
  return data as Campaign;
}

export async function deleteCampaign(id: string) {
  await api.delete(`/campaigns/${id}`);
}


export async function duplicateCampaign(sourceId: string) {
  const [camp, events] = await Promise.all([
    getCampaign(sourceId),
    listCampaignEvents(sourceId),
  ]);

  const newCamp = await createCampaign({
    name: `${camp.name} (Copy)`,
    description: camp.description ?? null,
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
  });

  for (const ev of payload.events || []) {
    await createCampaignEvent(newCamp.id, ev);
  }
  return newCamp;
}

export async function listCampaignEvents(campaignId: string): Promise<EventItem[]> {
  const { data } = await api.get(`/campaigns/${campaignId}/events`);
  return data;
}
export async function createCampaignEvent(campaignId: string, payload: Partial<EventItem>) {
  const body = normalizeEventPayload(payload);
  const { data } = await api.post(`/campaigns/${campaignId}/events`, body);
  return data as EventItem;
}
export async function updateEvent(eventId: string, payload: Partial<EventItem>) {
  const body = normalizeEventPayload(payload);
  const { data } = await api.put(`/events/${eventId}`, body);
  return data as EventItem;
}
export async function deleteEvent(eventId: string) {
  await api.delete(`/events/${eventId}`);
}

function normalizeEventPayload(p: Partial<EventItem>): Partial<EventItem> {
  const occurred = p.occurredAt ?? null;
  return {
    title: p.title?.trim() || "",
    description: p.description?.trim() ?? null,
    happenedIn: p.happenedIn?.trim() ?? null,
    occurredAt: occurred ? toISODate(occurred) : null,
  };
}
function toISODate(s: string): string {
  if (/\d{4}-\d{2}-\d{2}T/.test(s)) return s;
  return s;
}