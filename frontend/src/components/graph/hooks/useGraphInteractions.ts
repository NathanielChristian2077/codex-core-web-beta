import type { Simulation } from "d3-force";
import { useCallback, useRef } from "react";
import type { SimNode } from "../../../features/graphs/core/SimulationManager";

export function useGraphInteractions({
  nodeById,
  setFocusNodeId,
  setSelectedNodeId,
  simulationRef,
}: {
  nodeById: Map<string, SimNode>;
  setFocusNodeId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  simulationRef: React.RefObject<Simulation<SimNode, any> | null>;
}) {
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

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
    simulationRef.current?.alphaTarget(0.1);
  }, [nodeById, simulationRef]);

  // Hover
  const onNodeEnter = useCallback(
    (id: string) => {
      setFocusNodeId(id);
    },
    [setFocusNodeId]
  );

  const onNodeLeave = useCallback(() => {
    setFocusNodeId(null);
  }, [setFocusNodeId]);

  const onNodeDoubleClick = useCallback(
    (id: string) => {
      setSelectedNodeId(id);
    },
    [setSelectedNodeId]
  );

  return {
    onNodePointerDown,
    onNodeDragMove,
    onNodePointerUp,
    onNodeEnter,
    onNodeLeave,
    onNodeDoubleClick,
  };
}
