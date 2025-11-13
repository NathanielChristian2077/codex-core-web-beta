import api from "../../lib/apiClient";
import type { ObjectEntity } from "./types";

type Payload = { name: string; description?: string | null };

export const listObjects = (campaignId: string): Promise<ObjectEntity[]> =>
  api.get(`/campaigns/${campaignId}/objects`).then((r) => r.data);

export const createObject = (campaignId: string, p: Payload) =>
  api.post(`/campaigns/${campaignId}/objects`, p).then((r) => r.data);

export const updateObject = (id: string, p: Payload) =>
  api.put(`/objects/${id}`, p).then((r) => r.data);

export const deleteObject = (id: string) =>
  api.delete(`/objects/${id}`).then((r) => r.data);
