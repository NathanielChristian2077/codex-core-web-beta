import type { GraphResponse } from "../../api/contracts/edge";
import type { NodeDto } from "../../api/contracts/node";
import type { EdgeDto } from "../../api/contracts/edge";

import { type GraphData, type GraphLink, type GraphNode } from "./types";

/**
 * Adapta a resposta do backend novo (GET /projects/:id/graph) para o
 * formato interno do grafo (GraphData), com tipos dinâmicos.
 *
 * node.title          -> label
 * node.type.slug      -> type   (ex.: "character", "faction")
 * node.content        -> description
 * node.type.color     -> color  (fallback de estilo)
 * edge.sourceNodeId   -> source
 * edge.targetNodeId   -> target
 * edge.type.slug      -> type
 */
export function adaptCampaignGraphResponse(payload: GraphResponse): GraphData {
  const nodes: GraphNode[] = (payload.nodes ?? []).map((n: NodeDto) => ({
    id: n.id,
    label: n.title,
    type: n.type?.slug ?? n.typeId,
    description: n.content ?? null,
    color: n.type?.color ?? null,
  }));

  const links: GraphLink[] = (payload.edges ?? []).map((e: EdgeDto) => ({
    id: e.id,
    source: e.sourceNodeId,
    target: e.targetNodeId,
    type: e.type?.slug ?? e.typeId,
  }));

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
