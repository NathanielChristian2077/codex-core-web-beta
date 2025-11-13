import api from "../../lib/apiClient";
import type { LocationEntity } from "./types";

type Payload = { name: string; description?: string | null };

export const listLocations = (campaignId: string): Promise<LocationEntity[]> =>
  api.get(`/campaigns/${campaignId}/locations`).then((r) => r.data);

export const createLocation = (campaignId: string, p: Payload) =>
  api.post(`/campaigns/${campaignId}/locations`, p).then((r) => r.data);

export const updateLocation = (id: string, p: Payload) =>
  api.put(`/locations/${id}`, p).then((r) => r.data);

export const deleteLocation = (id: string) =>
  api.delete(`/locations/${id}`).then((r) => r.data);
