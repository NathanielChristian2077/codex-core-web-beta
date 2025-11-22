import api from "../../lib/apiClient";
import type { Character } from "./types";

type Payload = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
};

export const listCharacters = (
  campaignId: string,
): Promise<Character[]> =>
  api.get(`/campaigns/${campaignId}/characters`).then((r) => r.data);

export const createCharacter = (campaignId: string, p: Payload) =>
  api.post(`/campaigns/${campaignId}/characters`, p).then((r) => r.data);

export const updateCharacter = (id: string, p: Payload) =>
  api.put(`/characters/${id}`, p).then((r) => r.data);

export const deleteCharacter = (id: string) =>
  api.delete(`/characters/${id}`).then((r) => r.data);
