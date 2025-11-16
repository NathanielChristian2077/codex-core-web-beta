import type { Simulation } from "d3-force";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { useGraph } from "./GraphContext";
import type { GraphLink, GraphNode } from "./types";

import {
    createSimulation,
    type SimLink,
    type SimNode
} from "./core/SimulationManager";

import { GraphCanvas } from "./core/GraphCanvas";

const WIDTH = 1600;
const HEIGHT = 900;
const MAX_HIGHLIGHT_DEPTH = 3;

// basic deterministic jitter
function pseudo(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

type TimelinePositions = Record<string, { x: number; y: number }>;

export const GraphVisualization: React.FC = () => {
  const {
    graphData,
    filters,
    displaySettings,
    physicsSettings,
    nodePositions,
    setNodePositions,
    focusNodeId,
    setFocusNodeId,
    selectedNodeId,
    setSelectedNodeId,
    viewMode
  } = useGraph();

  const [simNodes, setSimNodes] = useState<SimNode[]>([]);
  const [simLinks, setSimLinks] = useState<SimLink[]>([]);
  const [, setFrameVersion] = useState(0);

  const simulationRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const nodeByIdRef = useRef<Map<string, SimNode>>(new Map());
  const neighborsRef = useRef<Record<string, string[]>>({});
  const lastRenderRef = useRef<number>(0);

  const [distanceById, setDistanceById] = useState<Record<string, number>>({});

  // ------------------------------
  // Filter nodes & links
  // ------------------------------
  const { visibleNodes, visibleLinks } = useMemo(() => {
    if (!graphData) {
      return {
        visibleNodes: [] as GraphNode[],
        visibleLinks: [] as GraphLink[]
      };
    }

    const allowedTypes = filters.types;
    const allowedRelations = filters.relations;

    const nodesFiltered = graphData.nodes.filter(n => allowedTypes[n.type]);
    const nodeSet = new Set(nodesFiltered.map(n => n.id));

    const linksFiltered = graphData.links.filter(
      l =>
        nodeSet.has(l.source) &&
        nodeSet.has(l.target) &&
        (allowedRelations[l.type] ?? true)
    );

    let finalNodes = nodesFiltered;
    if (filters.hideOrphans) {
      const connected = new Set<string>();
      linksFiltered.forEach(l => {
        connected.add(l.source);
        connected.add(l.target);
      });
      finalNodes = nodesFiltered.filter(n => connected.has(n.id));
    }

    return {
      visibleNodes: finalNodes,
      visibleLinks: linksFiltered
    };
  }, [graphData, filters]);

  // ------------------------------
  // Timeline positions (only in timeline mode)
  // ------------------------------
  const timelinePositions: TimelinePositions = useMemo(() => {
    if (viewMode !== "timeline") return {};

    const events = visibleNodes.filter(n => n.type === "EVENT");
    if (!events.length) return {};

    const sorted = [...events].sort((a, b) =>
      a.label.toLowerCase().localeCompare(b.label.toLowerCase())
    );

    const spacing = WIDTH / (sorted.length + 1);
    const baseY = HEIGHT / 2;
    const amplitude = 80;

    const positions: TimelinePositions = {};

    sorted.forEach((ev, index) => {
      const jitterSeed = pseudo(ev.id);
      const jitterNorm = ((jitterSeed % 201) - 100) / 100; // [-1, 1]
      const x = spacing * (index + 1);
      const y = baseY + jitterNorm * amplitude;
      positions[ev.id] = { x, y };
    });

    return positions;
  }, [viewMode, visibleNodes]);

  // ------------------------------
  // Build SimNodes / SimLinks when visible graph changes
  // ------------------------------
  useEffect(() => {
    if (!visibleNodes.length) {
      setSimNodes([]);
      setSimLinks([]);
      nodeByIdRef.current = new Map();
      neighborsRef.current = {};
      setDistanceById({});
      return;
    }

    const nodes: SimNode[] = visibleNodes.map(n => {
      const saved = nodePositions[n.id];
      return {
        ...n,
        x: saved?.x ?? Math.random() * WIDTH,
        y: saved?.y ?? Math.random() * HEIGHT
      };
    });

    const nodeById = new Map<string, SimNode>();
    nodes.forEach(n => nodeById.set(n.id, n));
    nodeByIdRef.current = nodeById;

    const links: SimLink[] = visibleLinks.map(l => {
      const source = nodeById.get(l.source);
      const target = nodeById.get(l.target);
      if (!source || !target) {
        // should not happen after filtering, but keep safe
        throw new Error("Link with missing node after filtering");
      }
      return {
        id: l.id,
        type: l.type,
        source,
        target
      };
    });

    const neighbors: Record<string, string[]> = {};
    links.forEach(l => {
      const s = l.source.id;
      const t = l.target.id;
      (neighbors[s] ||= []).push(t);
      (neighbors[t] ||= []).push(s);
    });
    neighborsRef.current = neighbors;

    setSimNodes(nodes);
    setSimLinks(links);
  }, [visibleNodes, visibleLinks, nodePositions]);

  // ------------------------------
  // Start / restart simulation when nodes/links/physics change
  // ------------------------------
  useEffect(() => {
    const nodes = simNodes;
    if (!nodes.length) {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
      return;
    }

    // stop previous
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }

    const timeline =
      viewMode === "timeline" ? timelinePositions : undefined;

    const sim = createSimulation(
      nodes,
      simLinks,
      {
        chargeStrength: physicsSettings.chargeStrength,
        linkDistance: physicsSettings.linkDistance,
        linkStrength: physicsSettings.linkStrength,
        centerStrength: physicsSettings.centerStrength,
        collisionRadius: physicsSettings.collisionRadius
      },
      timeline
    );

    sim.on("tick", () => {
      const now = performance.now();
      if (now - lastRenderRef.current > 33) {
        lastRenderRef.current = now;
        setFrameVersion(v => v + 1);
      }
    });

    sim.on("end", () => {
      const positions: Record<string, { x: number; y: number }> = {};
      nodes.forEach(n => {
        if (typeof n.x === "number" && typeof n.y === "number") {
          positions[n.id] = { x: n.x, y: n.y };
        }
      });
      setNodePositions(positions);
    });

    simulationRef.current = sim;

    return () => {
      sim.stop();
    };
  }, [
    simNodes,
    simLinks,
    physicsSettings.chargeStrength,
    physicsSettings.linkDistance,
    physicsSettings.linkStrength,
    physicsSettings.centerStrength,
    physicsSettings.collisionRadius,
    viewMode,
    timelinePositions,
    setNodePositions
  ]);

  // ------------------------------
  // BFS highlight distance from focus node
  // ------------------------------
  useEffect(() => {
    if (!focusNodeId) {
      setDistanceById({});
      return;
    }

    const neighbors = neighborsRef.current;
    if (!neighbors || !Object.keys(neighbors).length) {
      setDistanceById({});
      return;
    }

    const dist: Record<string, number> = {};
    const queue: string[] = [];

    dist[focusNodeId] = 0;
    queue.push(focusNodeId);

    while (queue.length > 0) {
      const current = queue.shift() as string;
      const currentDist = dist[current];
      if (currentDist >= MAX_HIGHLIGHT_DEPTH) continue;

      const next = neighbors[current] ?? [];
      for (const nid of next) {
        if (dist[nid] != null) continue;
        dist[nid] = currentDist + 1;
        queue.push(nid);
      }
    }

    setDistanceById(dist);
  }, [focusNodeId, simNodes.length]);

  // ------------------------------
  // Render
  // ------------------------------
  if (!graphData) {
    return (
      <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
        no graph data
      </div>
    );
  }

  return (
    <GraphCanvas
      nodes={simNodes}
      links={simLinks}
      focusNodeId={focusNodeId}
      selectedNodeId={selectedNodeId}
      distanceById={distanceById}
      nodeSizeBase={displaySettings.nodeSizeBase}
      edgeWidth={displaySettings.edgeWidth}
      showArrows={displaySettings.showArrows}
      nodeById={nodeByIdRef.current}
      setFocusNodeId={setFocusNodeId}
      setSelectedNodeId={setSelectedNodeId}
      simulationRef={simulationRef}
    />
  );
};

export default GraphVisualization;