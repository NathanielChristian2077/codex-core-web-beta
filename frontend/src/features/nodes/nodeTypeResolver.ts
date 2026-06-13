import * as nodeTypesApi from "../../api/modules/nodeTypes";
import type { NodeTypeDto } from "../../api/contracts/node";

// Cache de typeId por (projectId, slug) para não buscar a cada chamada.
const cache = new Map<string, string>();

const DEFAULT_META: Record<string, { name: string; color: string; icon: string }> = {
  event: { name: "Event", color: "#7c3aed", icon: "calendar" },
  character: { name: "Character", color: "#2563eb", icon: "user" },
  location: { name: "Location", color: "#16a34a", icon: "map-pin" },
  object: { name: "Object", color: "#d97706", icon: "package" },
};

function key(projectId: string, slug: string) {
  return `${projectId}:${slug}`;
}

function titleCase(slug: string) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * Devolve o id do NodeType com aquele slug no projeto.
 * Se ainda não existir (projeto sem preset), cria na hora.
 */
export async function resolveNodeTypeId(
  projectId: string,
  slug: string
): Promise<string> {
  const cacheKey = key(projectId, slug);
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const types: NodeTypeDto[] = await nodeTypesApi.listNodeTypes(projectId);
  let match = types.find((t) => t.slug === slug);

  if (!match) {
    const meta = DEFAULT_META[slug];
    match = await nodeTypesApi.createNodeType(projectId, {
      name: meta?.name ?? titleCase(slug),
      slug,
      color: meta?.color ?? "#64748b",
      icon: meta?.icon ?? "circle",
      fields: [],
    });
  }

  cache.set(cacheKey, match.id);
  return match.id;
}
