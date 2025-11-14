export type GraphNodeType = "EVENT" | "CHARACTER" | "LOCATION" | "OBJECT";

export type GraphRelationType = string;

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  description?: string | null;

  // calculado a partir das arestas
  degree?: number;

  // posições atuais
  x?: number;
  y?: number;

  // posições "fixas" usadas por d3-force (fx/fy)
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  type: GraphRelationType;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
