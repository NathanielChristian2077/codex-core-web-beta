import type { Simulation } from "d3-force";
import React, { CSSProperties, useEffect, useMemo, useState } from "react";

import { useGraphInteractions } from "../../../components/graph/hooks/useGraphInteractions";
import { useZoomAndPan } from "../../../components/graph/hooks/useZoomAndPan";
import { NodeQuickView } from "../../../components/graph/NodeQuickView";

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

  const selectedNode = selectedNodeId ? nodeById.get(selectedNodeId) ?? null : null;

  const [popupOffset, setPopupOffset] = useState<{ dx: number; dy: number }>({
    dx: 0,
    dy: 0,
  });

  useEffect(() => {
    setPopupOffset({ dx: 0, dy: 0 });
  }, [selectedNodeId]);

  const [svgSize, setSvgSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const updateSize = () => {
      const rect = svgEl.getBoundingClientRect();
      setSvgSize({ width: rect.width, height: rect.height });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [svgRef]);

    const popupStyle: CSSProperties | undefined = useMemo(() => {
    if (
      !selectedNode ||
      !svgSize ||
      typeof selectedNode.x !== "number" ||
      typeof selectedNode.y !== "number"
    ) {
      return undefined;
    }

    const { width, height } = svgSize;

    const svgX = camera.x + selectedNode.x * camera.scale;
    const svgY = camera.y + selectedNode.y * camera.scale;

    const pxX = (svgX / 1600) * width;
    const pxY = (svgY / 900) * height;

    return {
      position: "absolute",
      left: pxX + 12 + popupOffset.dx, 
      top: pxY - 12 + popupOffset.dy,  
    };
  }, [selectedNode, svgSize, camera, popupOffset]);


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
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedNodeId(null);
          }
        }}
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
      {selectedNode && (
        <NodeQuickView
          node={selectedNode}
          style={popupStyle}
          onClose={() => setSelectedNodeId(null)}
            onDrag={(dx, dy) => setPopupOffset(prev => ({
              dx: prev.dx + dx,
              dy: prev.dy + dy,
            }))
          }        
        />
      )}
    </div>
  );
};
