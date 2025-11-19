import React from "react";
import { useGraph } from "../../../features/graphs/GraphContext";
import { NodeEditPanel } from "./NodeEditPanel";
import { NodeViewPanel } from "./NodeQuickView";

type PanelKind = "view" | "edit";

type PanelEntry = {
  id: string;
  kind: PanelKind;
  nodeId: string;
  title: string;
};

export const GraphSidePanels: React.FC = () => {
  const {
    selectedNodeId,
    editingNodeId,
    graphData,
    setSelectedNodeId,
    setEditingNodeId,
  } = useGraph();

  const [openPanels, setOpenPanels] = React.useState<PanelEntry[]>([]);
  const [mounted, setMounted] = React.useState(false);

  if (!graphData) {
    return null;
  }

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  React.useEffect(() => {
    if (!selectedNodeId) return;
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
  }, [selectedNodeId, graphData]);

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
  }, [editingNodeId, graphData]);

  React.useEffect(() => {
    setOpenPanels((prev) =>
      prev.filter((panel) =>
        graphData.nodes.some((n) => n.id === panel.nodeId)
      )
    );
  }, [graphData]);

  const hasPanels = openPanels.length > 0;

  if (!hasPanels) {
    return null;
  }

  const containerClasses = [
    "pointer-events-auto flex h-full flex-col overflow-y-auto",
    "w-80 max-w-xs",
    "transition-transform duration-200 ease-out",
    mounted ? "translate-x-0" : "translate-x-full",
    "bg-slate-900/30 backdrop-blur-md border-l border-slate-800/60",
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

  return (
    <div className={containerClasses}>
      {openPanels.map((panel) => {
        const isTop = panel.id === topId;
        const node = graphData.nodes.find((n) => n.id === panel.nodeId) ?? null;
        if (!node) return null;

        return (
          <div
            key={panel.id}
            className={[
              "border-b border-slate-800/70",
              "transition-all duration-200 ease-out",
              "bg-slate-900/40",
              isTop ? "max-h-[70vh]" : "max-h-9 cursor-pointer",
            ].join(" ")}
            onClick={() => {
              if (!isTop) {
                bringToTop(panel.id);
              }
            }}
          >
            <div className="flex items-center justify-between gap-2 px-3 py-2">
              <div className="truncate text-[11px] font-semibold">
                {panel.title}
              </div>
              <button
                className="text-[10px] text-slate-400 hover:text-slate-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClosePanel(panel);
                }}
              >
                ×
              </button>
            </div>

            <div
              className={[
                "overflow-y-auto px-3 pb-3",
                isTop
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none",
              ].join(" ")}
            >
              {panel.kind === "view" && (
                <NodeViewPanel
                  node={node as any}
                  onClose={() => handleClosePanel(panel)}
                />
              )}

              {panel.kind === "edit" && <NodeEditPanel />}
            </div>
          </div>
        );
      })}
    </div>
  );
};
