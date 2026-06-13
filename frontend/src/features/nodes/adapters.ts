import type {
  CreateNodeRequest,
  NodeDto,
  UpdateNodeRequest,
} from "../../api/contracts/node";

// Entidade "clássica" da UI (Character/Location/Object): name + description + imageUrl.
export type EntityLike = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
};

// Event usa "title" no lugar de "name".
export type EventLike = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type EntityPayload = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
};

type EventPayload = {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
};

function imageUrlOf(node: NodeDto): string | null {
  const value = node.properties?.imageUrl;
  return typeof value === "string" ? value : null;
}

// ---- Node -> UI ----

export function nodeToEntity(node: NodeDto): EntityLike {
  return {
    id: node.id,
    name: node.title,
    description: node.content ?? null,
    imageUrl: imageUrlOf(node),
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
  };
}

export function nodeToEvent(node: NodeDto): EventLike {
  return {
    id: node.id,
    title: node.title,
    description: node.content ?? null,
    imageUrl: imageUrlOf(node),
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
  };
}

// ---- UI -> Node payload ----
// name/title -> title, description -> content, imageUrl -> properties.imageUrl.

export function entityToCreatePayload(
  typeId: string,
  p: EntityPayload
): CreateNodeRequest {
  return {
    typeId,
    title: (p.name ?? "").trim(),
    content: p.description !== undefined ? p.description?.trim() || null : null,
    properties: { imageUrl: p.imageUrl?.trim() || null },
  };
}

export function entityToUpdatePayload(
  p: Partial<EntityPayload>
): UpdateNodeRequest {
  const out: UpdateNodeRequest = {
    title: p.name?.trim(),
    content: p.description !== undefined ? p.description?.trim() || null : undefined,
  };
  // Só mexe em properties se imageUrl foi informado, senão o backend
  // preserva as properties atuais (COALESCE).
  if (p.imageUrl !== undefined) {
    out.properties = { imageUrl: p.imageUrl?.trim() || null };
  }
  return out;
}

export function eventToCreatePayload(
  typeId: string,
  p: EventPayload
): CreateNodeRequest {
  return {
    typeId,
    title: (p.title ?? "").trim(),
    content: p.description !== undefined ? p.description?.trim() || null : null,
    properties: { imageUrl: p.imageUrl?.trim() || null },
  };
}

export function eventToUpdatePayload(
  p: Partial<EventPayload>
): UpdateNodeRequest {
  const out: UpdateNodeRequest = {
    title: p.title?.trim(),
    content: p.description !== undefined ? p.description?.trim() || null : undefined,
  };
  if (p.imageUrl !== undefined) {
    out.properties = { imageUrl: p.imageUrl?.trim() || null };
  }
  return out;
}
