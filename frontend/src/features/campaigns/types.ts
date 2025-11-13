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
  events: Array<CampaignEventInput>;
};

export type CampaignEventInput = {
  title: string;
  description?: string | null;
  happenedIn?: string | null;
  occurredAt?: string | null;
  date?: string | null;
};

export type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  occurredAt?: string | null;
  happenedIn?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
