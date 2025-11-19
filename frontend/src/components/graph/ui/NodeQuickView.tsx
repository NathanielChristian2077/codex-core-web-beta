import React from "react";
import type { GraphNode } from "../../../features/graphs/types";

type NodeViewPanelProps = {
  node: GraphNode;
  onClose: () => void;
};

export const NodeViewPanel: React.FC<NodeViewPanelProps> = ({ node, onClose }) => {
  const hasDescription =
    typeof node.description === "string" && node.description.trim().length > 0;

  const relationCount =
    typeof (node as any).degree === "number" ? (node as any).degree : null;

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
          Relations: <span className="font-medium text-slate-200">{relationCount}</span>
        </p>
      )}

      <div className="mt-2 rounded-md border border-slate-700/80 bg-slate-900/60 p-2">
        <p className="mb-1 text-[10px] font-medium text-slate-300">
          Description
        </p>
        {node.description && node.description.trim().length > 0 ? (
          <p className="whitespace-pre-line text-[11px] text-slate-100/90">
            {node.description}
          </p>
        ) : (
          <p className="text-[10px] italic text-slate-500">
            No description yet.
          </p>
        )}
      </div>
    </div>
  );
};
