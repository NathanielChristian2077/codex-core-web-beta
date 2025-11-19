export type GraphNodeType = "EVENT" | "CHARACTER" | "LOCATION" | "OBJECT";

export type GraphRelationType = string;

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  description?: string | null;

  degree?: number;

  x?: number;
  y?: number;

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
