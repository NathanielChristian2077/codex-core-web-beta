export type InternalKind = "E" | "C" | "L" | "O";

export type InternalLink = {
  kind: InternalKind; // "E" | "C" | "L" | "O"
  name: string;
};

export type InternalLinkMeta = {
  exists: boolean;
};

export const INTERNAL_LINK_PROTOCOL = "codex://";

const TOKEN_REGEX = /<<([ECLO]):([^>]+)>>/g;

function isInternalKind(value: string): value is InternalKind {
  const v = value.toUpperCase();
  return v === "E" || v === "C" || v === "L" || v === "O";
}

export function encodeInternalLinks(markdown: string): string {
  if (!markdown) return "";

  return markdown.replace(
    TOKEN_REGEX,
    (_match, rawKind: string, rawName: string) => {
      const kind = String(rawKind).toUpperCase();
      const trimmedName = String(rawName).trim();

      if (!isInternalKind(kind) || !trimmedName) {
        return _match;
      }

      const encodedName = encodeURIComponent(trimmedName);

      return `[${trimmedName}](${INTERNAL_LINK_PROTOCOL}${kind}:${encodedName})`;
    }
  );
}

// decoder menos fresco: aceita espaços, lixo antes, etc.
export function decodeInternalLinkHref(
  href: string | undefined | null
): InternalLink | null {
  if (!href) return null;

  const trimmed = href.trim();

  // procura o protocolo em qualquer lugar, não só no início
  const protoIndex = trimmed.indexOf(INTERNAL_LINK_PROTOCOL);
  if (protoIndex === -1) return null;

  const rest = trimmed.slice(protoIndex + INTERNAL_LINK_PROTOCOL.length); // ex: "E:Bilbo%20Bolseiro"
  const colonIndex = rest.indexOf(":");
  if (colonIndex <= 0) return null;

  const kindRaw = rest.slice(0, colonIndex).toUpperCase();
  const rawName = rest.slice(colonIndex + 1);

  if (!isInternalKind(kindRaw)) return null;

  try {
    const decodedName = decodeURIComponent(rawName).trim();
    if (!decodedName) return null;

    return {
      kind: kindRaw as InternalKind,
      name: decodedName,
    };
  } catch {
    return null;
  }
}
