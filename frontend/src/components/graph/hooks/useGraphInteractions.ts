import type { Simulation } from "d3-force";
import React, { useCallback, useRef } from "react";
import type { SimNode } from "../../../features/graphs/core/SimulationManager";

export function useGraphInteractions({
  nodeById,
  setFocusNodeId,
  setSelectedNodeId,
  setEditingNodeId,
  simulationRef,
  autoZoomOnClick,
  focusOnWorldPoint,
}: {
  nodeById: Map<string, SimNode>;
  setFocusNodeId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  setEditingNodeId: (id: string | null) => void;
  simulationRef: React.RefObject<Simulation<SimNode, any> | null>;
  autoZoomOnClick: boolean;
  focusOnWorldPoint?: (x: number, y: number, opts?: { scale?: number }) => void;
}) {
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const hoverTimeoutRef = useRef<number | null>(null);

  // Start dragging (no teleport)
  const onNodePointerDown = useCallback(
    (id: string, nodeX: number, nodeY: number, wx: number, wy: number) => {
      const offsetX = nodeX - wx;
      const offsetY = nodeY - wy;

      dragRef.current = {
        id,
        offsetX,
        offsetY,
      };

      const n = nodeById.get(id);
      if (!n) return;

      n.fx = nodeX;
      n.fy = nodeY;

      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setFocusNodeId(id);

      simulationRef.current?.alphaTarget(0.3).restart();
    },
    [nodeById, setFocusNodeId, simulationRef]
  );

  // Drag movement
  const onNodeDragMove = useCallback(
    (wx: number, wy: number) => {
      const drag = dragRef.current;
      if (!drag) return;

      const n = nodeById.get(drag.id);
      if (!n) return;

      n.fx = wx + drag.offsetX;
      n.fy = wy + drag.offsetY;
    },
    [nodeById]
  );

  // Drop node
  const onNodePointerUp = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;

    const n = nodeById.get(drag.id);
    if (n) {
      n.fx = null;
      n.fy = null;
    }

    dragRef.current = null;
    simulationRef.current?.alphaTarget(0.0);
  }, [nodeById, simulationRef]);

  // Hover
  const onNodeEnter = useCallback(
    (id: string) => {
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setFocusNodeId(id);
    },
    [setFocusNodeId]
  );

  const onNodeLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = window.setTimeout(() => {
      setFocusNodeId(null);
    }, 80) as unknown as number;
  }, [setFocusNodeId]);

  const onNodeDoubleClick = useCallback(
    (id: string) => {
      setSelectedNodeId(id);
      if (!autoZoomOnClick || !focusOnWorldPoint) return;

      const n = nodeById.get(id);
      if (!n) return;
      if (typeof n.x !== "number" || typeof n.y !== "number") return;

      focusOnWorldPoint(n.x, n.y, { scale: 1.6 });
    },
    [autoZoomOnClick, focusOnWorldPoint, nodeById, setSelectedNodeId]
  );

  const onNodeRightClick = useCallback(
    (id: string) => {
      setSelectedNodeId(id);
      setEditingNodeId(id);
      setFocusNodeId(id);
      if (!autoZoomOnClick || !focusOnWorldPoint) return;

      const n = nodeById.get(id);
      if (!n) return;
      if (typeof n.x !== "number" || typeof n.y !== "number") return;

      focusOnWorldPoint(n.x, n.y, { scale: 1.6 });
    },
    [
      setSelectedNodeId,
      setFocusNodeId,
      setEditingNodeId,
      nodeById,
      focusOnWorldPoint,
      autoZoomOnClick,
    ]
  );

  return {
    onNodePointerDown,
    onNodeDragMove,
    onNodePointerUp,
    onNodeEnter,
    onNodeLeave,
    onNodeDoubleClick,
    onNodeRightClick,
  };
}
