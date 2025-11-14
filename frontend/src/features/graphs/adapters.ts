import {
    type CampaignGraphResponse,
    type GraphEdgeDto,
    type GraphNodeDto,
} from "../campaigns/api";

import {
    type GraphData,
    type GraphLink,
    type GraphNode,
    type GraphNodeType,
} from "./types";

export function adaptCampaignGraphResponse(
  payload: CampaignGraphResponse
): GraphData {
  const nodes: GraphNode[] = payload.nodes.map((n: GraphNodeDto) => ({
    id: n.id,
    label: n.label,
    type: n.type as GraphNodeType,
    description: n.description ?? null,
  }));

  const links: GraphLink[] = payload.edges.map((e: GraphEdgeDto) => ({
    id: e.id,
    source: e.from.id,
    target: e.to.id,
    type: e.kind,
  }));

  // Calcula o grau de cada nó (número de arestas incidentes)
  const degreeMap: Record<string, number> = {};

  links.forEach((link) => {
    degreeMap[link.source] = (degreeMap[link.source] ?? 0) + 1;
    degreeMap[link.target] = (degreeMap[link.target] ?? 0) + 1;
  });

  nodes.forEach((node) => {
    node.degree = degreeMap[node.id] ?? 0;
  });

  return { nodes, links };
}
