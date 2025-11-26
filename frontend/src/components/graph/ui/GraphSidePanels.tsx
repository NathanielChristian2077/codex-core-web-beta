import { Trash2, X } from "lucide-react";
import React from "react";
import { useGraph } from "../../../features/graphs/GraphContext";
import type {
  GraphNode,
  GraphNodeType,
} from "../../../features/graphs/types";
import type { InternalLink } from "../../../lib/internalLinks";
import { NodeEditPanel } from "./NodeEditPanel";
import { NodeViewPanel } from "./NodeQuickView";

type PanelKind = "view" | "edit";

type PanelEntry = {
  id: string;
  kind: PanelKind;
  nodeId: string;
  title: string;
};

type GraphSidePanelsProps = {
  onCreateFromInternalLink?: (link: InternalLink) => void;
};

function kindToNodeType(kind: InternalLink["kind"]): GraphNodeType | null {
  switch (kind) {
    case "E":
      return "EVENT";
    case "C":
      return "CHARACTER";
    case "L":
      return "LOCATION";
    case "O":
      return "OBJECT";
    default:
      return null;
  }
}

function resolveInternalLinkInGraph(
  link: InternalLink,
  nodes: GraphNode[],
): GraphNode | null {
  const targetType = kindToNodeType(link.kind);
  if (!targetType) return null;

  const normalizedName = link.name.trim().toLowerCase();

  return (
    nodes.find(
      (n) =>
        n.type === targetType &&
        (n.label ?? "").trim().toLowerCase() === normalizedName,
    ) ?? null
  );
}

const STORAGE_KEY = "cc_graph_sidepanels_v1";

type StoredState = {
  openPanels: PanelEntry[];
  isSheetOpen: boolean;
};

type SidePanelEntryProps = {
  panel: PanelEntry;
  isTop: boolean;
  node: GraphNode;
  onBringToTop: () => void;
  onClose: () => void;
  onInternalLinkClick: (link: InternalLink) => void;
};

const SidePanelEntry: React.FC<SidePanelEntryProps> = ({
  panel,
  isTop,
  node,
  onBringToTop,
  onClose,
  onInternalLinkClick,
}) => {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const cardClasses = [
    "border-b border-zinc-800/70",
    "transition-all duration-200 ease-out",
    "bg-zinc-900/70",
    "transform",
    entered ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
    isTop ? "max-h-[70vh]" : "max-h-9 cursor-pointer",
  ].join(" ");

  return (
    <div
      className={cardClasses}
      onClick={() => {
        if (!isTop) onBringToTop();
      }}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-2.5">
        <div className="min-w-0">
          <span className="block truncate text-[11px] font-semibold text-zinc-100">
            {panel.title}
          </span>
        </div>

        <button
          className="cursor-pointer flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="h-3 w-3"/>
        </button>
      </div>

      <div
        className={[
          "overflow-y-auto px-4 pb-4",
          isTop
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        {panel.kind === "view" && (
          <NodeViewPanel
            node={node as any}
            onClose={onClose}
            onInternalLinkClick={onInternalLinkClick}
          />
        )}

        {panel.kind === "edit" && <NodeEditPanel />}
      </div>
    </div>
  );
};

export const GraphSidePanels: React.FC<GraphSidePanelsProps> = ({
  onCreateFromInternalLink,
}) => {
  const {
    selectedNodeId,
    editingNodeId,
    graphData,
    setSelectedNodeId,
    setEditingNodeId,
    setFocusNodeId,
    zoomToNodeRef,
  } = useGraph();

  const [openPanels, setOpenPanels] = React.useState<PanelEntry[]>([]);
  const [mounted, setMounted] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(true);

  if (!graphData) return null;

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredState;
      if (Array.isArray(parsed.openPanels)) {
        setOpenPanels(parsed.openPanels);
      }
      if (typeof parsed.isSheetOpen === "boolean") {
        setIsSheetOpen(parsed.isSheetOpen);
      }
    } catch {

    }
  }, []);

  React.useEffect(() => {
    try {
      const payload: StoredState = { openPanels, isSheetOpen };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {

    }
  }, [openPanels, isSheetOpen]);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  React.useEffect(() => {
    if (!selectedNodeId || editingNodeId) return;
    const node = graphData.nodes.find((n) => n.id === selectedNodeId);
    if (!node) return;

    const panelId = `view-${node.id}`;
    setOpenPanels((prev) => {
      if (prev.some((p) => p.id === panelId)) return prev;
      return [
        ...prev,
        {
          id: panelId,
          kind: "view",
          nodeId: node.id,
          title: node.label ?? node.id,
        },
      ];
    });

    setIsSheetOpen(true);
  }, [selectedNodeId, editingNodeId, graphData]);

  React.useEffect(() => {
    if (!editingNodeId) return;
    const node = graphData.nodes.find((n) => n.id === editingNodeId);
    if (!node) return;

    const panelId = `edit-${node.id}`;
    setOpenPanels((prev) => {
      if (prev.some((p) => p.id === panelId)) return prev;
      return [
        ...prev,
        {
          id: panelId,
          kind: "edit",
          nodeId: node.id,
          title: `Edit · ${node.label ?? node.id}`,
        },
      ];
    });

    setIsSheetOpen(true);
  }, [editingNodeId, graphData]);

  React.useEffect(() => {
    setOpenPanels((prev) =>
      prev.filter((panel) =>
        graphData.nodes.some((n) => n.id === panel.nodeId),
      ),
    );
  }, [graphData]);

  const hasPanels = openPanels.length > 0;
  if (!hasPanels || !isSheetOpen) return null;

  const containerClasses = [
    "pointer-events-auto",
    "relative m-4 flex h-[calc(100%-2rem)] flex-col overflow-y-auto",
    "w-[360px] max-w-md",
    "rounded-2xl border border-zinc-800/80 bg-zinc-900/70",
    "backdrop-blur-xl shadow-2xl",
    "transition-transform duration-200 ease-out",
    mounted ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
  ].join(" ");

  const topId = openPanels[openPanels.length - 1].id;

  const bringToTop = (panelId: string) => {
    setOpenPanels((prev) => {
      const target = prev.find((p) => p.id === panelId);
      if (!target) return prev;
      const rest = prev.filter((p) => p.id !== panelId);
      return [...rest, target];
    });
  };

  const handleClosePanel = (panel: PanelEntry) => {
    setOpenPanels((prev) => prev.filter((p) => p.id !== panel.id));

    if (panel.kind === "view" && selectedNodeId === panel.nodeId) {
      setSelectedNodeId(null);
    }
    if (panel.kind === "edit" && editingNodeId === panel.nodeId) {
      setEditingNodeId(null);
    }
  };

  const handleInternalLinkClick = (link: InternalLink) => {
    const target = resolveInternalLinkInGraph(link, graphData.nodes);

    if (target) {
      const panelId = `view-${target.id}`;

      setOpenPanels((prev) => {
        const exists = prev.some((p) => p.id === panelId);
        if (!exists) {
          return [
            ...prev,
            {
              id: panelId,
              kind: "view",
              nodeId: target.id,
              title: target.label ?? target.id,
            },
          ];
        }
        return prev;
      });

      setSelectedNodeId(target.id);
      setFocusNodeId?.(target.id);
      bringToTop(panelId);
      zoomToNodeRef.current?.(target.id);
      return;
    }

    onCreateFromInternalLink?.(link);
  };

  const handleClearAll = () => {
    setOpenPanels([]);
    setSelectedNodeId(null);
    setEditingNodeId(null);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <div className={containerClasses}>
      <div className="pointer-events-auto absolute right-3 top-3 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={handleClearAll}
          className="
            cursor-pointer flex h-7 w-7 items-center justify-center
            rounded-full border border-zinc-600/70 bg-transparent
            text-zinc-400 transition
            hover:bg-zinc-800 hover:text-zinc-100
          "
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={handleCloseSheet}
          className="
            flex h-7 w-7 items-center justify-center
            rounded-full border border-red-500/80 bg-transparent
            text-red-500/90 text-sm font-semibold
            transition hover:bg-red-500/10
          "
        >
          <X className="h-3.5 w-3.5"/>
        </button>
      </div>

      <div className="mt-12 flex flex-col">
        {openPanels.map((panel) => {
          const isTop = panel.id === topId;
          const node =
            graphData.nodes.find((n) => n.id === panel.nodeId) ?? null;
          if (!node) return null;

          return (
            <SidePanelEntry
              key={panel.id}
              panel={panel}
              isTop={isTop}
              node={node}
              onBringToTop={() => bringToTop(panel.id)}
              onClose={() => handleClosePanel(panel)}
              onInternalLinkClick={handleInternalLinkClick}
            />
          );
        })}
      </div>
    </div>
  );
};
