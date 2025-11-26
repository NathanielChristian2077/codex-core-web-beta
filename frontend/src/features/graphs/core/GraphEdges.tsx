import React from "react";
import {
  getLinkStroke,
  isEventToEvent,
} from "../../../components/graph/helpers/link";
import { useGraph } from "../GraphContext";
import { getRelationMeta } from "../relations";
import type { SimLink } from "./SimulationManager";

type Props = {
  links: SimLink[];
  edgeWidth: number;
  showArrows: boolean;
  focusNodeId: string | null;
  distanceById: Record<string, number>;
};

function opacityForDistance(distance: number | undefined): number {
  if (distance == null) return 0.08;
  if (distance <= 1) return 1;
  if (distance === 2) return 0.5;
  if (distance === 3) return 0.4;
  return 0.12;
}

function getLinkOpacity(
  link: SimLink,
  focusNodeId: string | null,
  distanceById: Record<string, number>
): number {
  if (!focusNodeId) return 0.6;

  const sourceId = link.source.id;
  const targetId = link.target.id;

  const d1 = distanceById[sourceId];
  const d2 = distanceById[targetId];

  if (d1 == null && d2 == null) return 0.08;
  if (d1 == null) return opacityForDistance(d2);
  if (d2 == null) return opacityForDistance(d1);

  return opacityForDistance(Math.min(d1, d2));
}

export const GraphEdges: React.FC<Props> = ({
  links,
  edgeWidth,
  showArrows,
  focusNodeId,
  distanceById,
}) => {
  const { graphStyle } = useGraph();

  if (!links.length) return null;

  return (
    <g>
      {links.map((link) => {
        const source = link.source;
        const target = link.target;

        if (
          typeof source.x !== "number" ||
          typeof source.y !== "number" ||
          typeof target.x !== "number" ||
          typeof target.y !== "number"
        ) {
          return null;
        }

        const opacity = getLinkOpacity(link, focusNodeId, distanceById);

        const customEdge = graphStyle.edges[link.type];
        const stroke = customEdge?.stroke ?? getLinkStroke(link.type);

        const meta = getRelationMeta(link.type);

        const arrow =
          showArrows &&
          meta.directional &&
          isEventToEvent(source.type, target.type)
            ? "url(#arrow-temporal)"
            : undefined;

        return (
          <line
            key={link.id}
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={stroke}
            strokeWidth={edgeWidth}
            strokeLinecap="round"
            markerEnd={arrow}
            className="transition-opacity duration-200 ease-out"
            style={{ opacity }}
          />
        );
      })}
    </g>
  );
};
