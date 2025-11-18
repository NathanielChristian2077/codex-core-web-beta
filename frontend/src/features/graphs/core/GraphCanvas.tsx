import type { Simulation } from "d3-force";
import React from "react";

import { useGraphInteractions } from "../../../components/graph/hooks/useGraphInteractions";
import { useZoomAndPan } from "../../../components/graph/hooks/useZoomAndPan";

import { GraphEdges } from "./GraphEdges";
import { GraphNodes } from "./GraphNodes";
import type { SimLink, SimNode } from "./SimulationManager";

type Props = {
  nodes: SimNode[];
  links: SimLink[];

  // highlight
  focusNodeId: string | null;
  selectedNodeId: string | null;
  distanceById: Record<string, number>;

  // display settings
  nodeSizeBase: number;
  edgeWidth: number;
  showArrows: boolean;

  // graph / simulation plumbing
  nodeById: Map<string, SimNode>;
  setFocusNodeId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  simulationRef: React.RefObject<Simulation<SimNode, SimLink> | null>;
  autoZoomOnClick: boolean;
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
  simulationRef,
  autoZoomOnClick,
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

  

  const {
    onNodePointerDown,
    onNodeDragMove,
    onNodePointerUp,
    onNodeEnter,
    onNodeLeave,
    onNodeDoubleClick
  } = useGraphInteractions({
    nodeById,
    setFocusNodeId,
    setSelectedNodeId,
    simulationRef,
    autoZoomOnClick,
    focusOnWorldPoint,
  });

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
      >
        {/* Arrow marker for temporal / directional links */}
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

        {/* Camera transform */}
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
          />
        </g>
      </svg>
    </div>
  );
};
