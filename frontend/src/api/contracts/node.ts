// NodeType e Node — substituem Event/Character/Location/Object.
// Formas em graph_store.go (ListNodesJSON / nodeJSON).

export type FieldType =
  | "text"
  | "long_text"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "multi_select"
  | "url"
  | "node_ref";

export type FieldDefinition = {
  key: string;
  label?: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
};

export type NodeTypeDto = {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  fields: FieldDefinition[];
  createdAt: string;
  updatedAt: string;
};

// properties é um objeto aberto (imageUrl, age, status, ...).
export type NodeProperties = Record<string, unknown>;

export type NodeDto = {
  id: string;
  projectId: string;
  typeId: string;
  title: string;
  content: string | null;
  properties: NodeProperties;
  createdAt: string;
  updatedAt: string;
  // type só vem nas listagens/graph (JOIN com node_types).
  type?: NodeTypeDto;
};

export type CreateNodeRequest = {
  typeId: string;
  title: string;
  content?: string | null;
  properties?: NodeProperties;
};

export type UpdateNodeRequest = {
  typeId?: string;
  title?: string;
  content?: string | null;
  properties?: NodeProperties;
};

export type NodeFilters = {
  typeId?: string;
  typeSlug?: string;
  search?: string;
};

export type CreateNodeTypeRequest = {
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  fields?: FieldDefinition[];
};
