import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation
} from "d3-force";
import type { GraphNode } from "../types";

export type SimNode = GraphNode & {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
};

export type SimLink = {
  id: string;
  type: string;
  source: SimNode;
  target: SimNode;
};

type Physics = {
  chargeStrength: number;
  linkDistance: number;
  linkStrength: number;
  centerStrength: number;
  collisionRadius: number;
};

const WIDTH = 1600;
const HEIGHT = 900;

function isOrphan(n: SimNode): boolean {
  return (n.degree ?? 0) === 0;
}

/** Creates a fully configured d3-force simulation */
export function createSimulation(
  nodes: SimNode[],
  links: SimLink[],
  physics: Physics,
  timeline?: Record<string, { x: number; y: number }>
) {
  const sim: Simulation<SimNode, SimLink> = forceSimulation(nodes)
    // Repulsion only for non-orphans
    .force(
      "charge",
      forceManyBody<SimNode>().strength(n =>
        isOrphan(n) ? 0 : physics.chargeStrength
      )
    )
    .force(
      "link",
      forceLink<SimNode, SimLink>(links)
        .id(d => (d as SimNode).id)
        .distance(physics.linkDistance)
        .strength(physics.linkStrength)
    )
    // Soft centering; combinado com velocityDecay alto pra ficar “fluido”
    .force(
      "center",
      forceCenter(WIDTH / 2, HEIGHT / 2).strength(physics.centerStrength)
    )
    // Orphans praticamente ignoram colisão
    .force(
      "collide",
      forceCollide<SimNode>().radius(n =>
        isOrphan(n) ? 0 : Math.max(20, physics.collisionRadius)
      )
    )
    // Começa moderado, esfria suave, mas com bastante amortecimento
    .alpha(0.4)
    .alphaDecay(0.02)
    .velocityDecay(0.7);

  if (timeline) {
    // Timeline com força mais suave pra não ficar “quicando”
    sim.force(
      "timelineX",
      forceX<SimNode>(n => timeline[(n as SimNode).id]?.x ?? WIDTH / 2).strength(0.5)
    );

    sim.force(
      "timelineY",
      forceY<SimNode>(n => timeline[(n as SimNode).id]?.y ?? HEIGHT / 2).strength(0.5)
    );
  }

  return sim;
}
