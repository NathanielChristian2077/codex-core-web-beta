// EdgeType e Edge — relações entre nodes. Formas em graph_store.go (ListEdgesJSON).

export type EdgeTypeDto = {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  description: string | null;
  directed: boolean;
  color: string | null;
  strokeStyle: string | null;
  fields: unknown[];
  createdAt: string;
  updatedAt: string;
};

export type EdgeDto = {
  id: string;
  projectId: string;
  sourceNodeId: string;
  targetNodeId: string;
  typeId: string;
  properties: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  type?: EdgeTypeDto;
};

export type CreateEdgeRequest = {
  sourceNodeId: string;
  targetNodeId: string;
  typeId: string;
  properties?: Record<string, unknown>;
};

export type UpdateEdgeRequest = {
  sourceNodeId?: string;
  targetNodeId?: string;
  typeId?: string;
  properties?: Record<string, unknown>;
};

export type CreateEdgeTypeRequest = {
  name: string;
  slug: string;
  description?: string | null;
  directed?: boolean;
  color?: string | null;
  strokeStyle?: string | null;
  fields?: unknown[];
};

// GET /projects/{id}/graph
export type GraphResponse = {
  nodes: import("./node").NodeDto[];
  edges: EdgeDto[];
};
