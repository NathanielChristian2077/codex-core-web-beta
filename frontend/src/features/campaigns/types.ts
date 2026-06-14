import type { ProjectExport } from "../../api/contracts/project";

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

// Mantido como alias por compat: o snapshot agora vem do backend (/export).
export type CampaignExport = ProjectExport;
