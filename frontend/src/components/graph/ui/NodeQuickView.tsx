import React from "react";
import type { GraphNode } from "../../../features/graphs/types";
import {
  INTERNAL_LINK_PROTOCOL,
  type InternalLink,
} from "../../../lib/internalLinks";
import { MarkdownRenderer } from "../../markdown/MarkdownRenderer";

type NodeViewPanelProps = {
  node: GraphNode;
  onClose: () => void;
  onInternalLinkClick?: (link: InternalLink) => void;
};

function parseInternalLinkFromHref(
  hrefRaw: string | null,
): InternalLink | null {
  if (!hrefRaw) return null;
  const href = hrefRaw.trim();
  if (!href || !href.includes(INTERNAL_LINK_PROTOCOL)) return null;

  const idx = href.indexOf(INTERNAL_LINK_PROTOCOL);
  const rest = href.slice(idx + INTERNAL_LINK_PROTOCOL.length);
  const colonIndex = rest.indexOf(":");
  if (colonIndex <= 0) return null;

  const kindRaw = rest.slice(0, colonIndex).toUpperCase();
  const rawName = rest.slice(colonIndex + 1);

  if (!["E", "C", "L", "O"].includes(kindRaw)) return null;

  let decodedName = rawName;
  try {
    decodedName = decodeURIComponent(rawName);
  } catch {

  }

  const name = decodedName.trim();
  if (!name) return null;

  return {
    kind: kindRaw as InternalLink["kind"],
    name,
  };
}

export const NodeViewPanel: React.FC<NodeViewPanelProps> = ({
  node,
  onInternalLinkClick,
}) => {
  const hasDescription =
    typeof node.description === "string" &&
    node.description.trim().length > 0;

  const relationCount =
    typeof (node as any).degree === "number"
      ? ((node as any).degree as number)
      : null;

  const handleDescriptionClickCapture = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const anchor = target.closest("a") as HTMLAnchorElement | null;
    if (!anchor) return;

    e.preventDefault();
    e.stopPropagation();

    const hrefAttr = anchor.getAttribute("href");
    const href = hrefAttr?.trim() || anchor.href?.trim();
    if (!href) return;

    const link = parseInternalLinkFromHref(href);
    if (link) {
      onInternalLinkClick?.(link);
      return;
    }

    try {
      window.open(href, "_blank", "noopener,noreferrer");
    } catch {

    }
  };

  return (
    <div className="space-y-3 text-[11px] text-zinc-100">
      <div>
        <p className="text-[10px] uppercase tracking-wide text-zinc-400">
          Node · <span className="font-medium text-zinc-200">{node.type}</span>
        </p>
        <h2 className="truncate text-xs font-semibold text-zinc-100">
          {node.label ?? node.id}
        </h2>
      </div>

      {relationCount != null && (
        <p className="text-[10px] text-zinc-400">
          Relations:{" "}
          <span className="font-medium text-zinc-200">{relationCount}</span>
        </p>
      )}

      <div className="mt-1 rounded-md border border-zinc-700/80 bg-zinc-900/60 p-2">
        <p className="mb-1 text-[10px] font-medium text-zinc-300">
          Description
        </p>

        {hasDescription ? (
          <div
            className="max-h-64 overflow-y-auto text-[11px]"
            onClickCapture={handleDescriptionClickCapture}
          >
            <MarkdownRenderer
              content={node.description as string}
              className="prose prose-sm dark:prose-invert max-w-none"
            />
          </div>
        ) : (
          <p className="text-[10px] italic text-zinc-500">
            No description yet.
          </p>
        )}
      </div>
    </div>
  );
};
