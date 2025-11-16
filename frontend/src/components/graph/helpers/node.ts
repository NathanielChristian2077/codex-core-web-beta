import type { GraphNode } from "../../../features/graphs/types";

const DEGREE_SIZE_FACTOR = 4;

/**
 * Base node radius adjusted by node degree (log scale).
 */
export function getNodeRadius(node: GraphNode, base: number): number {
  const degree = node.degree ?? 0;
  return base + DEGREE_SIZE_FACTOR * Math.log(1 + degree);
}

/**
 * Opacity curve for highlight wave / distance from focus node.
 */
export function opacityForDistance(distance: number): number {
  if (distance <= 1) return 1;
  if (distance === 2) return 0.5;
  if (distance === 3) return 0.4;
  return 0.12;
}
