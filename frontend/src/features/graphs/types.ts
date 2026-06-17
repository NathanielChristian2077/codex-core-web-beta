// Tipo de node agora é dinâmico (slug do NodeType): "character", "faction", etc.
export type GraphNodeType = string;

export type GraphRelationType = string;

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  description?: string | null;

  /** Cor do NodeType (vem do backend) usada como fallback de estilo. */
  color?: string | null;

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
