import React from "react";
import { nodeEditAdapters } from "../../../features/graphs/core/NodeEditAdapters";
import { useGraph } from "../../../features/graphs/GraphContext";
import type { GraphNodeType } from "../../../features/graphs/types";
import { MarkdownEditor } from "../../markdown/MarkdownEditor";

export const NodeEditPanel: React.FC = () => {
  const {
    graphData,
    setGraphDataFromOutside,
    nodePositions,
    setNodePositions,
    editingNodeId,
    setEditingNodeId,
  } = useGraph();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [initialTitle, setInitialTitle] = React.useState<string>("");
  const [initialDescription, setInitialDescription] = React.useState<string>("");
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const node =
    editingNodeId && graphData
      ? graphData.nodes.find((n) => n.id === editingNodeId) ?? null
      : null;

  React.useEffect(() => {
    if (!node) return;

    const desc =
      typeof (node as any).description === "string"
        ? ((node as any).description as string)
        : "";

    const label = node.label ?? node.id;

    setTitle(label);
    setDescription(desc);
    setInitialTitle(label);
    setInitialDescription(desc);
  }, [node]);

  if (!node || !graphData) return null;

  const adapter = nodeEditAdapters[node.type as GraphNodeType];

  const handleClose = () => {
    setEditingNodeId(null);
  };

  const handleSave = async () => {
    if (!adapter) return;
    setSaving(true);

    try {
      const trimmedTitle = title.trim();
      const trimmedDesc = description.trim();

      const payload: { title?: string; description?: string | null } = {};

      if (trimmedTitle && trimmedTitle !== initialTitle) {
        payload.title = trimmedTitle;
      }

      if (trimmedDesc !== initialDescription.trim()) {
        payload.description = trimmedDesc.length > 0 ? trimmedDesc : null;
      }

      if (Object.keys(payload).length === 0) {
        handleClose();
        return;
      }

      await adapter.update(node.id, payload);

      const updated = {
        ...graphData,
        nodes: graphData.nodes.map((n) =>
          n.id === node.id
            ? {
                ...n,
                label: payload.title ?? n.label,
                description:
                  payload.description !== undefined
                    ? payload.description
                    : (n as any).description ?? null,
              }
            : n
        ),
      };

      setGraphDataFromOutside(updated);
      handleClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!adapter) return;
    setDeleting(true);

    try {
      await adapter.remove(node.id);

      const updated = {
        ...graphData,
        nodes: graphData.nodes.filter((n) => n.id !== node.id),
        links: graphData.links.filter(
          (l) => l.source !== node.id && l.target !== node.id
        ),
      };

      setGraphDataFromOutside(updated);

      const copy = { ...nodePositions };
      delete copy[node.id];
      setNodePositions(copy);

      handleClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="text-slate-100 text-[11px] space-y-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            Edit node
          </p>
          <h2 className="truncate text-xs font-semibold">
            {node.label ?? node.id}
          </h2>
        </div>
        <button
          className="text-[10px] text-slate-400 hover:text-slate-100"
          onClick={handleClose}
        >
          ×
        </button>
      </div>

      <p className="text-[10px] text-slate-400">
        Type: <span className="font-medium text-slate-200">{node.type}</span>
      </p>

      <div className="space-y-2">
        <div>
          <label className="mb-1 block text-[10px] font-medium text-slate-300">
            Name / Title
          </label>
          <input
            className="w-full rounded border border-slate-700 bg-slate-900/70 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-slate-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <MarkdownEditor
            value={description}
            onChange={setDescription}
            label="Description"
            placeholder="Add a description using markdown..."
            className="space-y-1"
            tone="dark"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          className="rounded border border-red-500 px-3 py-1 text-[11px] text-red-300 hover:bg-red-500/10 disabled:opacity-60"
          onClick={handleDelete}
          disabled={deleting || saving}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>

        <div className="space-x-2">
          <button
            className="rounded border border-slate-600 px-3 py-1 text-[11px] text-slate-200 hover:bg-slate-700/60 disabled:opacity-60"
            onClick={handleClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="rounded bg-emerald-600 px-3 py-1 text-[11px] text-white hover:bg-emerald-500 disabled:opacity-60"
            onClick={handleSave}
            disabled={saving || deleting}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
