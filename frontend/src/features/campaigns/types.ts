export type Campaign = {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: { events?: number };
};

export type CampaignExport = {
  campaign: Campaign;
  events: Array<EventItem>;
};

export type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
