import { getCampaignGraph } from "../campaigns/api";
import { adaptCampaignGraphResponse } from "./adapters";
import type { GraphData } from "./types";

/**
 * Carrega o grafo do projeto. No backend novo cada node já traz seu
 * `content` (descrição), então basta buscar o grafo e adaptar — sem
 * precisar enriquecer com chamadas por tipo de entidade.
 */
export async function loadGraphDataWithDescriptions(
  campaignId: string
): Promise<GraphData> {
  const graph = await getCampaignGraph(campaignId);
  return adaptCampaignGraphResponse(graph);
}
