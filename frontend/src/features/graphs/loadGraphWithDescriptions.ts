import { getCampaignGraph, listCampaignEvents } from "../campaigns/api";
import { listCharacters } from "../characters/api";
import { listLocations } from "../locations/api";
import { listObjects } from "../objects/api";

import { adaptCampaignGraphResponse } from "./adapters";
import type { GraphData } from "./types";

export async function loadGraphDataWithDescriptions(
  campaignId: string
): Promise<GraphData> {
  const [graphRes, events, characters, locations, objects] = await Promise.all([
    getCampaignGraph(campaignId),
    listCampaignEvents(campaignId),
    listCharacters(campaignId),
    listLocations(campaignId),
    listObjects(campaignId),
  ]);

  const base = adaptCampaignGraphResponse(graphRes);

  const descById = new Map<string, string | null>();

  events.forEach((ev) => {
    descById.set(ev.id, ev.description ?? null);
  });

  characters.forEach((ch) => {
    descById.set(ch.id, ch.description ?? null);
  });

  locations.forEach((loc) => {
    descById.set(loc.id, loc.description ?? null);
  });

  objects.forEach((obj) => {
    descById.set(obj.id, obj.description ?? null);
  });

  const nodes = base.nodes.map((node) => {
    const fromEntities = descById.has(node.id)
      ? descById.get(node.id) ?? null
      : null;

    return {
      ...node,
      description: fromEntities ?? (node as any).description ?? null,
    };
  });

  return {
    ...base,
    nodes,
  };
}
