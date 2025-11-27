import type { Character } from "../characters/types";
import type { LocationEntity } from "../locations/types";
import type { ObjectEntity } from "../objects/types";

export type Campaign = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: { events?: number };
};

export type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string | null;
};

export type CampaignExport = {
  campaign: Campaign;
  events: EventItem[];
  characters: Character[];
  locations: LocationEntity[];
  objects: ObjectEntity[];
};
