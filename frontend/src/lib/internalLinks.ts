export type InternalLink = {
  /** slug do NodeType: "event" | "character" | "faction" | ... */
  type: string;
  name: string;
};

export type InternalLinkMeta = {
  exists: boolean;
};

export const INTERNAL_LINK_PROTOCOL = "codex://";

// Aliases antigos de uma letra -> slug do tipo.
const ALIASES: Record<string, string> = {
  e: "event",
  c: "character",
  l: "location",
  o: "object",
};

/**
 * Normaliza o tipo de um link interno.
 * Aceita o alias antigo (E/C/L/O) e o slug novo (character, faction, ...).
 */
function normalizeType(raw: string): string | null {
  const v = raw.trim().toLowerCase();
  if (!v) return null;
  if (ALIASES[v]) return ALIASES[v];
  if (/^[a-z][\w-]*$/.test(v)) return v;
  return null;
}

// Casa <<character:Nome>>, <<E:Nome>>, <<faction:Nome>>, etc.
const TOKEN_REGEX = /<<([a-zA-Z_][\w-]*):([^>]+)>>/g;

export function encodeInternalLinks(markdown: string): string {
  if (!markdown) return "";

  return markdown.replace(
    TOKEN_REGEX,
    (_match, rawType: string, rawName: string) => {
      const type = normalizeType(rawType);
      const trimmedName = String(rawName).trim();

      if (!type || !trimmedName) return _match;

      const encodedName = encodeURIComponent(trimmedName);
      return `[${trimmedName}](${INTERNAL_LINK_PROTOCOL}${type}:${encodedName})`;
    }
  );
}

// Decoder tolerante: aceita espaços, lixo antes do protocolo, ECLO ou slug.
export function decodeInternalLinkHref(
  href: string | undefined | null
): InternalLink | null {
  if (!href) return null;

  const trimmed = href.trim();
  const protoIndex = trimmed.indexOf(INTERNAL_LINK_PROTOCOL);
  if (protoIndex === -1) return null;

  const rest = trimmed.slice(protoIndex + INTERNAL_LINK_PROTOCOL.length);
  const colonIndex = rest.indexOf(":");
  if (colonIndex <= 0) return null;

  const type = normalizeType(rest.slice(0, colonIndex));
  if (!type) return null;

  try {
    const decodedName = decodeURIComponent(rest.slice(colonIndex + 1)).trim();
    if (!decodedName) return null;
    return { type, name: decodedName };
  } catch {
    return null;
  }
}

// Tipos com página dedicada; os demais (faction, god, ...) caem no grafo.
const SLUG_ROUTE: Record<string, string> = {
  event: "timeline",
  character: "characters",
  location: "locations",
  object: "objects",
};

export function pathForNodeType(type: string, projectId: string): string {
  const segment = SLUG_ROUTE[type];
  return segment
    ? `/campaigns/${projectId}/${segment}`
    : `/campaigns/${projectId}/graph`;
}
