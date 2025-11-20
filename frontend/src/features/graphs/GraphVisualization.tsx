// features/graphs/GraphVisualization.tsx
import { CalendarDays, MapPin, Package2, User } from "lucide-react";
import { AnimatePresence } from "motion/react";
import {
  RadialMenuOverlay,
  type MenuItem as RadialMenuItem,
} from "../../components/ui/radial-menu";
import { useCurrentCampaign } from "../../store/useCurrentCampaign";
import { useSession } from "../../store/useSession";

import type { Simulation } from "d3-force";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { useGraph } from "./GraphContext";
import type { GraphLink, GraphNode } from "./types";

import {
  createSimulation,
  type SimLink,
  type SimNode,
} from "./core/SimulationManager";

import { GraphLayoutMode } from "../../components/graph/helpers/graphLayout";
import { GraphSidePanels } from "../../components/graph/ui/GraphSidePanels";
import { GraphCanvas } from "./core/GraphCanvas";

import { getCampaignGraph } from "../campaigns/api";
import { adaptCampaignGraphResponse } from "./adapters";

import EntityModal from "../../components/entity/EntityModal";
import EventModal from "../../components/timeline/EventModal";

import type { InternalLink } from "../../lib/internalLinks";
import { createCharacter } from "../characters/api";
import { createLocation } from "../locations/api";
import { createObject } from "../objects/api";

const WIDTH = 1600;
const HEIGHT = 900;
const MAX_HIGHLIGHT_DEPTH = 3;

type TimelinePositions = Record<string, { x: number; y: number }>;

const GRAPH_MENU_ITEMS: RadialMenuItem[] = [
  { id: 1, label: "Create event", icon: CalendarDays },
  { id: 2, label: "Create character", icon: User },
  { id: 3, label: "Create location", icon: MapPin },
  { id: 4, label: "Create object", icon: Package2 },
];

type GraphBackgroundAction = "event" | "character" | "location" | "object";

const ACTION_BY_ID: Record<number, GraphBackgroundAction> = {
  1: "event",
  2: "character",
  3: "location",
  4: "object",
};

type CreateContext =
  | {
      kind: "event";
      worldX: number;
      worldY: number;
      initialTitle?: string;
    }
  | {
      kind: "character" | "location" | "object";
      worldX: number;
      worldY: number;
      initialName?: string;
    };

function pseudo(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export const GraphVisualization: React.FC = () => {
  const {
    graphData,
    setGraphDataFromOutside,
    filters,
    displaySettings,
    physicsSettings,
    nodePositions,
    setNodePositions,
    focusNodeId,
    setFocusNodeId,
    selectedNodeId,
    setSelectedNodeId,
    viewMode,
    editingNodeId,
    setEditingNodeId,
    graphStyle,
  } = useGraph();

  const [simNodes, setSimNodes] = useState<SimNode[]>([]);
  const [simLinks, setSimLinks] = useState<SimLink[]>([]);
  const [, setFrameVersion] = useState(0);
  const [layoutMode, setLayoutMode] = useState<GraphLayoutMode>("chaos");

  const simulationRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const nodeByIdRef = useRef<Map<string, SimNode>>(new Map());
  const neighborsRef = useRef<Record<string, string[]>>({});
  const lastRenderRef = useRef<number>(0);

  const [distanceById, setDistanceById] = useState<Record<string, number>>({});

  const { isLogged } = useSession();
  const { currentCampaignId } = useCurrentCampaign();
  const canEditGraph = isLogged && !!currentCampaignId;

  const [backgroundContextMenu, setBackgroundContextMenu] = useState<{
    screenX: number;
    screenY: number;
    worldX: number;
    worldY: number;
  } | null>(null);

  const [noPermissionTooltip, setNoPermissionTooltip] = useState<{
    screenX: number;
    screenY: number;
  } | null>(null);

  const [createContext, setCreateContext] = useState<CreateContext | null>(
    null
  );

  const { visibleNodes, visibleLinks } = useMemo(() => {
    if (!graphData) {
      return {
        visibleNodes: [] as GraphNode[],
        visibleLinks: [] as GraphLink[],
      };
    }

    const allowedTypes = filters.types;
    const allowedRelations = filters.relations;

    const nodesFiltered = graphData.nodes.filter((n) => allowedTypes[n.type]);
    const nodeSet = new Set(nodesFiltered.map((n) => n.id));

    const linksFiltered = graphData.links.filter(
      (l) =>
        nodeSet.has(l.source) &&
        nodeSet.has(l.target) &&
        (allowedRelations[l.type] ?? true)
    );

    let finalNodes = nodesFiltered;
    if (filters.hideOrphans) {
      const connected = new Set<string>();
      linksFiltered.forEach((l) => {
        connected.add(l.source);
        connected.add(l.target);
      });
      finalNodes = nodesFiltered.filter((n) => connected.has(n.id));
    }

    return {
      visibleNodes: finalNodes,
      visibleLinks: linksFiltered,
    };
  }, [graphData, filters]);

  const timelinePositions: TimelinePositions = useMemo(() => {
    if (viewMode !== "timeline") return {};

    const events = visibleNodes.filter((n) => n.type === "EVENT");
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
      const jitterNorm = ((jitterSeed % 201) - 100) / 100;
      const x = spacing * (index + 1);
      const y = baseY + jitterNorm * amplitude;
      positions[ev.id] = { x, y };
    });

    return positions;
  }, [viewMode, visibleNodes]);

  function handleGraphBackgroundAction(
    action: GraphBackgroundAction,
    ctx: { worldX: number; worldY: number }
  ) {
    if (!currentCampaignId) {
      setBackgroundContextMenu(null);
      return;
    }

    setCreateContext({
      kind: action,
      worldX: ctx.worldX,
      worldY: ctx.worldY,
    });

    setBackgroundContextMenu(null);
  }

  async function handleEntityCreated(entityId: string) {
    if (!currentCampaignId || !createContext) return;

    try {
      const raw = await getCampaignGraph(currentCampaignId);
      const adapted = adaptCampaignGraphResponse(raw);
      setGraphDataFromOutside(adapted);

      const { worldX, worldY } = createContext;
      const mergedPositions = {
        ...nodePositions,
        [entityId]: { x: worldX, y: worldY },
      };
      setNodePositions(mergedPositions);
    } finally {
      setCreateContext(null);
    }
  }

  const handleCreateFromInternalLink = (link: InternalLink) => {
    const worldX = WIDTH / 2;
    const worldY = HEIGHT / 2;

    switch (link.kind) {
      case "E":
        setCreateContext({
          kind: "event",
          worldX,
          worldY,
          initialTitle: link.name,
        });
        break;
      case "C":
        setCreateContext({
          kind: "character",
          worldX,
          worldY,
          initialName: link.name,
        });
        break;
      case "L":
        setCreateContext({
          kind: "location",
          worldX,
          worldY,
          initialName: link.name,
        });
        break;
      case "O":
        setCreateContext({
          kind: "object",
          worldX,
          worldY,
          initialName: link.name,
        });
        break;
    }
  };

  useEffect(() => {
    if (!visibleNodes.length) {
      setSimNodes([]);
      setSimLinks([]);
      nodeByIdRef.current = new Map();
      neighborsRef.current = {};
      setDistanceById({});
      return;
    }

    const nodes: SimNode[] = visibleNodes.map((n) => {
      const saved = nodePositions[n.id];
      return {
        ...n,
        x: saved?.x ?? Math.random() * WIDTH,
        y: saved?.y ?? Math.random() * HEIGHT,
      };
    });

    const nodeById = new Map<string, SimNode>();
    nodes.forEach((n) => nodeById.set(n.id, n));
    nodeByIdRef.current = nodeById;

    const links: SimLink[] = visibleLinks.map((l) => {
      const source = nodeById.get(l.source);
      const target = nodeById.get(l.target);
      if (!source || !target) {
        throw new Error("Link with missing node after filtering");
      }
      return {
        id: l.id,
        type: l.type,
        source,
        target,
      };
    });

    const neighbors: Record<string, string[]> = {};
    links.forEach((l) => {
      const s = l.source.id;
      const t = l.target.id;
      (neighbors[s] ||= []).push(t);
      (neighbors[t] ||= []).push(s);
    });
    neighborsRef.current = neighbors;

    setSimNodes(nodes);
    setSimLinks(links);
  }, [visibleNodes, visibleLinks, nodePositions]);

  useEffect(() => {
    const nodes = simNodes;
    if (!nodes.length) {
      if (simulationRef.current) {
        simulationRef.current.stop();
        simulationRef.current = null;
      }
      return;
    }

    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }

    const timeline = viewMode === "timeline" ? timelinePositions : undefined;

    const sim = createSimulation(
      nodes,
      simLinks,
      {
        chargeStrength: physicsSettings.chargeStrength,
        linkDistance: physicsSettings.linkDistance,
        linkStrength: physicsSettings.linkStrength,
        centerStrength: physicsSettings.centerStrength,
        collisionRadius: physicsSettings.collisionRadius,
      },
      timeline,
      layoutMode
    );

    sim.on("tick", () => {
      setFrameVersion((v) => v + 1);
    });

    sim.on("end", () => {
      const positions: Record<string, { x: number; y: number }> = {};
      nodes.forEach((n) => {
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
    setNodePositions,
    layoutMode,
  ]);

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

  if (!graphData) {
    return (
      <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
        no graph data
      </div>
    );
  }

  const entityNameByKind: Record<
    Exclude<GraphBackgroundAction, "event">,
    string
  > = {
    character: "Character",
    location: "Location",
    object: "Object",
  };

  return (
    <div className="relative h-full w-full">
      {/* graph underneath */}
      <div className="h-full w-full">
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
          setEditingNodeId={setEditingNodeId}
          simulationRef={simulationRef}
          autoZoomOnClick={displaySettings.autoZoomOnClick}
          backgroundColor={graphStyle.background}
          onBackgroundContextMenu={({ screenX, screenY, worldX, worldY }) => {
            if (!canEditGraph) {
              setBackgroundContextMenu(null);
              setNoPermissionTooltip({ screenX, screenY });
              window.setTimeout(() => setNoPermissionTooltip(null), 2000);
              return;
            }
            setNoPermissionTooltip(null);
            setBackgroundContextMenu({ screenX, screenY, worldX, worldY });
          }}
        />
      </div>

      {/* right side panels */}
      <div className="pointer-events-none absolute inset-0 flex justify-end">
        <GraphSidePanels
          onCreateFromInternalLink={handleCreateFromInternalLink}
        />
      </div>

      {/* radial context menu on background right-click */}
      <AnimatePresence>
        {backgroundContextMenu && canEditGraph && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: backgroundContextMenu.screenX,
                top: backgroundContextMenu.screenY,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <RadialMenuOverlay
                menuItems={GRAPH_MENU_ITEMS}
                onSelect={(item) => {
                  if (item.id === -1) {
                    setBackgroundContextMenu(null);
                    return;
                  }

                  const action = ACTION_BY_ID[item.id];
                  if (!action) return;
                  handleGraphBackgroundAction(action, backgroundContextMenu);
                }}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* no-permission tooltip */}
      {noPermissionTooltip && !canEditGraph && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md bg-zinc-900 px-3 py-1 text-xs text-white shadow-lg"
            style={{
              left: noPermissionTooltip.screenX,
              top: noPermissionTooltip.screenY,
            }}
          >
            You are not allowed to edit this graph.
          </div>
        </div>
      )}

      {/* Event creation modal (custom) */}
      {createContext && currentCampaignId && createContext.kind === "event" && (
        <EventModal
          open
          onClose={() => setCreateContext(null)}
          campaignId={currentCampaignId}
          editing={null}
          initialTitle={createContext.initialTitle}
          onSaved={undefined}
          onCreated={(ev) => handleEntityCreated(ev.id)}
        />
      )}

      {/* Generic EntityModal for character / location / object */}
      {createContext && currentCampaignId && createContext.kind !== "event" && (
        <EntityModal
          open
          onClose={() => setCreateContext(null)}
          entityName={entityNameByKind[createContext.kind]}
          editing={null}
          initialName={createContext.initialName}
          onSave={async (payload) => {
            if (!currentCampaignId) return;

            switch (createContext.kind) {
              case "character": {
                const created = await createCharacter(currentCampaignId, {
                  name: payload.name,
                  description: payload.description ?? null,
                });
                await handleEntityCreated(created.id);
                break;
              }
              case "location": {
                const created = await createLocation(currentCampaignId, {
                  name: payload.name,
                  description: payload.description ?? null,
                });
                await handleEntityCreated(created.id);
                break;
              }
              case "object": {
                const created = await createObject(currentCampaignId, {
                  name: payload.name,
                  description: payload.description ?? null,
                });
                await handleEntityCreated(created.id);
                break;
              }
              default:
                break;
            }
          }}
        />
      )}
    </div>
  );
};

export default GraphVisualization;
