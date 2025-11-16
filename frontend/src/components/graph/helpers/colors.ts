import type { GraphNode } from "../../../features/graphs/types";

export type NodeColor = {
  fill: string;
  stroke: string;
};

/**
 * Color palette per node type.
 */
export function getNodeColor(type: GraphNode["type"]): NodeColor {
  switch (type) {
    case "EVENT":
      return {
        fill: "rgba(56,189,248,0.2)",
        stroke: "rgba(56,189,248,0.9)"
      }; // sky
    case "CHARACTER":
      return {
        fill: "rgba(52,211,153,0.18)",
        stroke: "rgba(52,211,153,0.9)"
      }; // emerald
    case "LOCATION":
      return {
        fill: "rgba(249,115,22,0.18)",
        stroke: "rgba(249,115,22,0.9)"
      }; // orange
    case "OBJECT":
      return {
        fill: "rgba(244,114,182,0.16)",
        stroke: "rgba(244,114,182,0.9)"
      }; // pink
    default:
      return {
        fill: "rgba(148,163,184,0.2)",
        stroke: "rgba(148,163,184,0.9)"
      };
  }
}
