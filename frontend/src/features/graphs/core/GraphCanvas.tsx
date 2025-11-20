// GraphCanvas
import type { Simulation } from "d3-force";
import React, { useCallback, useEffect } from "react";

import { useGraphInteractions } from "../../../components/graph/hooks/useGraphInteractions";
import { useZoomAndPan } from "../../../components/graph/hooks/useZoomAndPan";

import { useGraph } from "../GraphContext";
import { GraphEdges } from "./GraphEdges";
import { GraphNodes } from "./GraphNodes";
import type { SimLink, SimNode } from "./SimulationManager";

const WIDTH = 1600;
const HEIGHT = 900;

type BackgroundContextMenuPayload = {
  screenX: number;
  screenY: number;
  worldX: number;
  worldY: number;
};

type Props = {
  nodes: SimNode[];
  links: SimLink[];
  focusNodeId: string | null;
  selectedNodeId: string | null;
  distanceById: Record<string, number>;
  nodeSizeBase: number;
  edgeWidth: number;
  showArrows: boolean;
  nodeById: Map<string, SimNode>;
  setFocusNodeId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  setEditingNodeId: (id: string | null) => void;
  simulationRef: React.RefObject<Simulation<SimNode, SimLink> | null>;
  autoZoomOnClick: boolean;
  onBackgroundContextMenu?: (payload: BackgroundContextMenuPayload) => void;
  backgroundColor?: string;
};

export const GraphCanvas: React.FC<Props> = ({
  nodes,
  links,
  focusNodeId,
  selectedNodeId,
  distanceById,
  nodeSizeBase,
  edgeWidth,
  showArrows,
  nodeById,
  setFocusNodeId,
  setSelectedNodeId,
  setEditingNodeId,
  simulationRef,
  autoZoomOnClick,
  onBackgroundContextMenu,
  backgroundColor,
}) => {
  const {
    camera,
    svgRef,
    containerRef,
    handleSvgPointerDown,
    handleSvgPointerMove,
    handleSvgPointerUp,
    getWorldPointFromPointer,
    focusOnWorldPoint,
  } = useZoomAndPan();

  const { zoomToNodeRef } = useGraph();

  useEffect(() => {
    zoomToNodeRef.current = (id: string) => {
      const node = nodeById.get(id);
      if (!node) return;

      if (typeof node.x !== "number" || typeof node.y !== "number") return;

      focusOnWorldPoint(node.x, node.y, { scale: 1.6 });
    };
  }, [zoomToNodeRef, nodeById, focusOnWorldPoint]);

  const {
    onNodePointerDown,
    onNodeDragMove,
    onNodePointerUp,
    onNodeEnter,
    onNodeLeave,
    onNodeDoubleClick,
    onNodeRightClick,
  } = useGraphInteractions({
    nodeById,
    setFocusNodeId,
    setSelectedNodeId,
    setEditingNodeId,
    simulationRef,
    autoZoomOnClick,
    focusOnWorldPoint,
  });

  const handleSvgContextMenu = useCallback(
    (event: React.MouseEvent<SVGSVGElement>) => {
      event.preventDefault();

      if (event.target !== event.currentTarget) return;
      if (!onBackgroundContextMenu) return;

      const container = containerRef.current;
      const svg = svgRef.current;
      if (!container || !svg) return;

      const containerRect = container.getBoundingClientRect();
      const localX = event.clientX - containerRect.left;
      const localY = event.clientY - containerRect.top;

      const svgRect = svg.getBoundingClientRect();
      const sx = ((event.clientX - svgRect.left) / svgRect.width) * WIDTH;
      const sy = ((event.clientY - svgRect.top) / svgRect.height) * HEIGHT;

      const worldX = (sx - camera.x) / camera.scale;
      const worldY = (sy - camera.y) / camera.scale;

      onBackgroundContextMenu({
        screenX: localX,
        screenY: localY,
        worldX,
        worldY,
      });
    },
    [onBackgroundContextMenu, containerRef, svgRef, camera]
  );

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden"
      style={{ overscrollBehavior: "contain" }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
        className="overflow-hidden rounded-2xl"
        onPointerDown={handleSvgPointerDown}
        onPointerMove={handleSvgPointerMove}
        onPointerUp={handleSvgPointerUp}
        onPointerLeave={handleSvgPointerUp}
        onContextMenu={handleSvgContextMenu}
        style={{ backgroundColor: backgroundColor ?? "transparent" }}
      >
        <defs>
          <marker
            id="arrow-temporal"
            viewBox="0 0 10 10"
            refX={10}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(148,163,184,0.9)" />
          </marker>
        </defs>

        <g
          transform={`translate(${camera.x}, ${camera.y}) scale(${camera.scale})`}
        >
          <GraphEdges
            links={links}
            edgeWidth={edgeWidth}
            showArrows={showArrows}
            focusNodeId={focusNodeId}
            distanceById={distanceById}
          />

          <GraphNodes
            nodes={nodes}
            nodeSizeBase={nodeSizeBase}
            focusNodeId={focusNodeId}
            selectedNodeId={selectedNodeId}
            distanceById={distanceById}
            getWorldPointFromPointer={getWorldPointFromPointer}
            onNodePointerDown={onNodePointerDown}
            onNodeDragMove={onNodeDragMove}
            onNodePointerUp={onNodePointerUp}
            onNodeEnter={onNodeEnter}
            onNodeLeave={onNodeLeave}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeRightClick={onNodeRightClick}
          />
        </g>
      </svg>
    </div>
  );
};

export default GraphCanvas;
