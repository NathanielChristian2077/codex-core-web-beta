// View e Layout — posições/layout do grafo (substituem localStorage).

export type ViewDto = {
  id: string;
  projectId: string;
  name: string;
  mode: string;
  filters: Record<string, unknown>;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type CreateViewRequest = {
  name: string;
  mode?: string;
  filters?: Record<string, unknown>;
  settings?: Record<string, unknown>;
};

export type LayoutDto = {
  nodeId: string;
  x: number;
  y: number;
  locked: boolean;
};

export type UpsertLayoutRequest = {
  nodeId: string;
  x: number;
  y: number;
  locked?: boolean;
};
