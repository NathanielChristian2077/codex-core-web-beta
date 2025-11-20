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

export const NodeViewPanel: React.FC<NodeViewPanelProps> = ({
  node,
  onClose,
  onInternalLinkClick,
}) => {
  const hasDescription =
    typeof node.description === "string" && node.description.trim().length > 0;

  const relationCount =
    typeof (node as any).degree === "number"
      ? ((node as any).degree as number)
      : null;

  const handleDescriptionClickCapture = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const anchor = target.closest("a") as HTMLAnchorElement | null;
    if (!anchor) return;

    // mata a navegação padrão SEMPRE
    e.preventDefault();
    e.stopPropagation();

    // tenta primeiro o atributo, depois a propriedade resolvida
    const hrefAttr = anchor.getAttribute("href");
    const href = (hrefAttr && hrefAttr.trim()) || (anchor.href ?? "").trim();

    console.log("[NODE VIEW] anchor href =", href);

    if (!href) return;

    if (href.includes(INTERNAL_LINK_PROTOCOL)) {
      try {
        const idx = href.indexOf(INTERNAL_LINK_PROTOCOL);
        const rest = href.slice(idx + INTERNAL_LINK_PROTOCOL.length); // "E:Uma%20Festa..."
        const colonIndex = rest.indexOf(":");
        if (colonIndex <= 0) return;

        const kindRaw = rest.slice(0, colonIndex).toUpperCase();
        const rawName = rest.slice(colonIndex + 1);

        if (
          kindRaw !== "E" &&
          kindRaw !== "C" &&
          kindRaw !== "L" &&
          kindRaw !== "O"
        ) {
          return;
        }

        let decodedName = rawName;
        try {
          decodedName = decodeURIComponent(rawName);
        } catch {
          // paciência
        }

        const link: InternalLink = {
          kind: kindRaw as InternalLink["kind"],
          name: decodedName.trim(),
        };

        console.log("[NODE VIEW] internal link parsed", link);
        onInternalLinkClick?.(link);
      } catch {
        // não explode nada
      }

      return;
    }

    // se algum dia tiver link externo, abre manual
    try {
      window.open(href, "_blank", "noopener,noreferrer");
    } catch {
      // se o navegador não quiser, problema dele
    }
  };

  return (
    <div className="text-slate-100 text-[11px] space-y-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            View node
          </p>
          <h2 className="truncate text-xs font-semibold">
            {node.label ?? node.id}
          </h2>
        </div>
        <button
          className="text-[10px] text-slate-400 hover:text-slate-100"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <p className="text-[10px] text-slate-400">
        Type: <span className="font-medium text-slate-200">{node.type}</span>
      </p>

      {relationCount != null && (
        <p className="text-[10px] text-slate-400">
          Relations:{" "}
          <span className="font-medium text-slate-200">{relationCount}</span>
        </p>
      )}

      <div className="mt-2 rounded-md border border-slate-700/80 bg-slate-900/60 p-2">
        <p className="mb-1 text-[10px] font-medium text-slate-300">
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
          <p className="text-[10px] italic text-slate-500">
            No description yet.
          </p>
        )}
      </div>
    </div>
  );
};
