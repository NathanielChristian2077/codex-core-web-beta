export type Campaign = {
  id: string;
  name: string;
  desc?: string | null;
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
  desc?: string | null;
  happenedIn?: string | null;
  occurredAt?: string | null;
  date?: string | null;
};
