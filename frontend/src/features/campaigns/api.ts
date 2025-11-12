import api from "../../lib/apiClient";
import type { Campaign } from "./types";

export async function listCampaigns(): Promise<Campaign[]> {
  const { data } = await api.get("/campaigns");
  return data;
}

export async function createCampaign(payload: {
  name: string;
  desc?: string | null;
}) {
  const { data } = await api.post("/campaigns", payload);
  return data;
}

export async function updateCampaign(id: string, payload: Partial<Campaign>) {
  const { data } = await api.put(`/campaigns/${id}`, payload);
  return data;
}

export async function deleteCampaign(id: string) {
  await api.delete(`/campaigns/${id}`);
}
