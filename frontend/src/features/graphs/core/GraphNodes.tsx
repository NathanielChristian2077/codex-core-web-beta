import React, { useCallback } from "react";
import {
  getNodeRadius,
  opacityForDistance,
} from "../../../components/graph/helpers/node";
import { useGraph } from "../GraphContext";
import type { SimNode } from "./SimulationManager";

type Props = {
  nodes: SimNode[];
  nodeSizeBase: number;
  focusNodeId: string | null;
  selectedNodeId: string | null;
  distanceById: Record<string, number>;

  getWorldPointFromPointer: (
    event: React.PointerEvent<Element>
  ) => { x: number; y: number } | null;

  onNodePointerDown: (
    id: string,
    nodeX: number,
    nodeY: number,
    wx: number,
    wy: number
  ) => void;
  onNodeDragMove: (wx: number, wy: number) => void;
  onNodePointerUp: () => void;
  onNodeEnter: (id: string) => void;
  onNodeLeave: () => void;
  onNodeDoubleClick: (id: string) => void;
  onNodeRightClick: (id: string) => void;
};

export const GraphNodes: React.FC<Props> = ({
  nodes,
  nodeSizeBase,
  focusNodeId,
  selectedNodeId,
  distanceById,
  getWorldPointFromPointer,
  onNodePointerDown,
  onNodeDragMove,
  onNodePointerUp,
  onNodeEnter,
  onNodeLeave,
  onNodeDoubleClick,
  onNodeRightClick,
}) => {
  const handlePointerDown = useCallback(
    (node: SimNode) => (event: React.PointerEvent<SVGGElement>) => {
      event.stopPropagation();
      event.preventDefault();

      const world = getWorldPointFromPointer(event);
      if (!world) return;

      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // ignore
      }

      if (typeof node.x === "number" && typeof node.y === "number") {
        onNodePointerDown(node.id, node.x, node.y, world.x, world.y);
      }
    },
    [getWorldPointFromPointer, onNodePointerDown]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGGElement>) => {
      const anyTarget = event.currentTarget as any;
      if (!anyTarget.hasPointerCapture?.(event.pointerId)) {
        return;
      }

      const world = getWorldPointFromPointer(event);
      if (!world) return;

      onNodeDragMove(world.x, world.y);
    },
    [getWorldPointFromPointer, onNodeDragMove]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<SVGGElement>) => {
      try {
        (event.currentTarget as any).releasePointerCapture?.(event.pointerId);
      } catch {
        // ignore
      }
      onNodePointerUp();
    },
    [onNodePointerUp]
  );

  const { graphStyle } = useGraph();

  if (!nodes.length) return null;

  return (
    <g>
      {nodes.map((node) => {
        if (typeof node.x !== "number" || typeof node.y !== "number") {
          return null;
        }

        const r = getNodeRadius(node, nodeSizeBase);
        const colorCfg = graphStyle.nodes[node.type] ?? {
          fill: "rgba(148,163,184,0.2)",
          stroke: "rgba(148,163,184,0.9)",
        };

        const distance = distanceById[node.id];
        const baseOpacity = focusNodeId ? opacityForDistance(distance) : 1;
        const isSelected = selectedNodeId === node.id;

        return (
          <g
            key={node.id}
            transform={`translate(${node.x}, ${node.y})`}
            onPointerDown={handlePointerDown(node)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={onNodeLeave}
            onPointerEnter={() => onNodeEnter(node.id)}
            onDoubleClick={() => onNodeDoubleClick(node.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onNodeRightClick(node.id);
            }}
            className="cursor-grab transition-opacity duration-200 ease-out"
            style={{ opacity: baseOpacity }}
          >
            {isSelected && (
              <circle
                r={r + 4}
                fill="none"
                stroke="rgba(251,191,36,0.9)"
                strokeWidth={1.5}
              />
            )}

            <circle
              r={r}
              fill={colorCfg.fill}
              stroke={colorCfg.stroke}
              strokeWidth={isSelected ? 2 : 1.2}
            />

            <text
              x={0}
              y={r + 10}
              textAnchor="middle"
              className="select-none"
              fontSize={10}
              fill="rgba(148,163,184,0.95)"
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </g>
  );
};
