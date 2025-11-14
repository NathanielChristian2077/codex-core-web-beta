import {
    forceCenter,
    forceCollide,
    forceLink,
    forceManyBody,
    forceSimulation,
    forceX,
    forceY,
    type Simulation,
    type SimulationLinkDatum,
    type SimulationNodeDatum,
} from "d3-force";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { useGraph } from "./GraphContext";
import type { GraphLink, GraphNode } from "./types";

type SimNode = GraphNode & SimulationNodeDatum;
type SimLink = SimulationLinkDatum<SimNode> & {
    id: string;
    type: string;
};

const DEGREE_SIZE_FACTOR = 4;
const WIDTH = 1600;
const HEIGHT = 900;

const MAX_HIGHLIGHT_DEPTH = 3;

type TimelinePositions = Record<string, { x: number; y: number }>;

const GraphVisualization: React.FC = () => {
    const {
        graphData,
        filters,
        displaySettings,
        physicsSettings,
        nodePositions,
        setNodePositions,
        focusNodeId,
        setFocusNodeId,
        viewMode,
    } = useGraph();

    const [simNodes, setSimNodes] = useState<SimNode[]>([]);
    const [simLinks, setSimLinks] = useState<SimLink[]>([]);
    const [, setFrameVersion] = useState(0); // força re-render nos ticks

    const simulationRef = useRef<Simulation<SimNode, SimLink> | null>(null);
    const lastRenderRef = useRef<number>(0);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const nodeByIdRef = useRef<Map<string, SimNode>>(new Map());
    const neighborsRef = useRef<Record<string, string[]>>({});

    const dragStateRef = useRef<{
        nodeId: string;
        lastX: number;
        lastY: number;
    } | null>(null);

    const [distanceById, setDistanceById] = useState<Record<string, number>>({});

    // 1) Filtrar nós/arestas com base nos filtros atuais
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

        return { visibleNodes: finalNodes, visibleLinks: linksFiltered };
    }, [graphData, filters]);

    // 2) Timeline positions (somente quando viewMode = timeline)
    const timelinePositions: TimelinePositions = useMemo(() => {
        if (viewMode !== "timeline") return {};

        const events = visibleNodes.filter((n) => n.type === "EVENT");
        if (!events.length) return {};

        const sorted = [...events].sort((a, b) => {
            if (a.label.toLowerCase() < b.label.toLowerCase()) return -1;
            if (a.label.toLowerCase() > b.label.toLowerCase()) return 1;
            return a.id.localeCompare(b.id);
        });

        const spacing = WIDTH / (sorted.length + 1);
        const baseY = HEIGHT / 2;
        const amplitude = 80;

        const positions: TimelinePositions = {};

        sorted.forEach((ev, index) => {
            const x = spacing * (index + 1);
            const jitterSeed = pseudoRandomFromId(ev.id);
            const jitterNorm = ((jitterSeed % 201) - 100) / 100; // [-1, 1]
            const y = baseY + jitterNorm * amplitude;
            positions[ev.id] = { x, y };
        });

        return positions;
    }, [viewMode, visibleNodes]);

    // 3) Inicializar simNodes/simLinks quando visibleNodes/visibleLinks mudarem
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

        const idToNode = new Map<string, SimNode>();
        nodes.forEach((n) => idToNode.set(n.id, n));

        const links: SimLink[] = visibleLinks.map((l) => ({
            id: l.id,
            type: l.type,
            source: idToNode.get(l.source) ?? (l.source as any),
            target: idToNode.get(l.target) ?? (l.target as any),
        }));

        setSimNodes(nodes);
        setSimLinks(links);
        nodeByIdRef.current = idToNode;

        const neighbors: Record<string, string[]> = {};
        links.forEach((l) => {
            const s = (l.source as SimNode).id;
            const t = (l.target as SimNode).id;
            if (!neighbors[s]) neighbors[s] = [];
            if (!neighbors[t]) neighbors[t] = [];
            neighbors[s].push(t);
            neighbors[t].push(s);
        });
        neighborsRef.current = neighbors;
    }, [visibleNodes, visibleLinks, nodePositions]);

    // 4) Configurar simulação d3-force (incluindo modo timeline)
    useEffect(() => {
        if (!simNodes.length) {
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

        const sim = forceSimulation<SimNode>(simNodes)
            .force(
                "charge",
                forceManyBody().strength(physicsSettings.chargeStrength)
            )
            .force(
                "link",
                forceLink<SimNode, SimLink>(simLinks)
                    .id((d) => d.id)
                    .distance(physicsSettings.linkDistance)
                    .strength(physicsSettings.linkStrength)
            )
            .force(
                "center",
                forceCenter(WIDTH / 2, HEIGHT / 2).strength(
                    viewMode === "timeline"
                        ? physicsSettings.centerStrength * 0.1
                        : physicsSettings.centerStrength
                )
            )
            .force(
                "collide",
                forceCollide<SimNode>().radius((d) => {
                    const visualRadius = getNodeRadius(d, displaySettings.nodeSizeBase);
                    return Math.max(visualRadius, physicsSettings.collisionRadius);
                })
            )
            .alpha(1)
            .alphaDecay(0.03);


        if (viewMode === "timeline") {
            const fx = forceX<SimNode>((d) => {
                const pos = timelinePositions[d.id];
                if (pos) return pos.x;
                return WIDTH / 2;
            }).strength((d) => (d.type === "EVENT" ? 1 : 0.04));

            const fy = forceY<SimNode>((d) => {
                const pos = timelinePositions[d.id];
                if (pos) return pos.y;
                return HEIGHT / 2;
            }).strength((d) => (d.type === "EVENT" ? 1 : 0.04));

            sim.force("timelineX", fx);
            sim.force("timelineY", fy);
        }

        sim.on("tick", () => {
            const now = performance.now();
            if (now - lastRenderRef.current > 33) {
                lastRenderRef.current = now;
                setFrameVersion((v) => v + 1);
            }
        });

        sim.on("end", () => {
            const positions: Record<string, { x: number; y: number }> = {};
            simNodes.forEach((n) => {
                if (typeof n.x === "number" && typeof n.y === "number") {
                    positions[n.id] = { x: n.x, y: n.y };
                }
            });
            setNodePositions(positions);
        });

        simulationRef.current = sim;

        return () => {
            sim.stop();
            simulationRef.current = null;
        };
    }, [
        simNodes,
        simLinks,
        physicsSettings.chargeStrength,
        physicsSettings.linkDistance,
        physicsSettings.linkStrength,
        physicsSettings.centerStrength,
        physicsSettings.collisionRadius,
        displaySettings.nodeSizeBase,
        setNodePositions,
        viewMode,
        timelinePositions,
    ]);

    // 5) Cálculo da onda de relevância (distância por BFS)
    useEffect(() => {
        if (!focusNodeId) {
            setDistanceById({});
            return;
        }

        const neighbors = neighborsRef.current;
        if (!neighbors) {
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

    // 6) Helpers de coordenadas SVG

    function getSvgCoords(event: React.PointerEvent<SVGElement>) {
        const svg = svgRef.current;
        if (!svg) return null;

        const rect = svg.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * WIDTH;
        const y = ((event.clientY - rect.top) / rect.height) * HEIGHT;

        return { x, y };
    }

    // 7) Drag com pseudo-inércia

    function handleNodePointerDown(
        nodeId: string,
        event: React.PointerEvent<SVGGElement>
    ) {
        event.preventDefault();
        event.stopPropagation();

        const coords = getSvgCoords(event);
        if (!coords) return;

        const node = nodeByIdRef.current.get(nodeId);
        if (!node) return;

        dragStateRef.current = {
            nodeId,
            lastX: coords.x,
            lastY: coords.y,
        };

        node.fx = coords.x;
        node.fy = coords.y;

        setFocusNodeId(nodeId);

        if (simulationRef.current) {
            simulationRef.current.alphaTarget(0.3).restart();
        }
    }

    function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
        const dragState = dragStateRef.current;
        if (!dragState) return;

        const coords = getSvgCoords(event);
        if (!coords) return;

        const { nodeId, lastX, lastY } = dragState;
        const dx = coords.x - lastX;
        const dy = coords.y - lastY;

        dragStateRef.current = {
            nodeId,
            lastX: coords.x,
            lastY: coords.y,
        };

        const node = nodeByIdRef.current.get(nodeId);
        if (!node) return;

        node.fx = coords.x;
        node.fy = coords.y;

        const neighbors = neighborsRef.current[nodeId] ?? [];
        const visited = new Set<string>();
        visited.add(nodeId);

        neighbors.forEach((nid) => {
            visited.add(nid);
            const n = nodeByIdRef.current.get(nid);
            if (!n) return;
            if (typeof n.x === "number" && typeof n.y === "number") {
                n.x += dx * 0.6;
                n.y += dy * 0.6;
            }
        });

        const secondLevel = new Set<string>();
        neighbors.forEach((nid) => {
            const next = neighborsRef.current[nid] ?? [];
            next.forEach((nid2) => {
                if (!visited.has(nid2)) {
                    secondLevel.add(nid2);
                }
            });
        });

        secondLevel.forEach((nid) => {
            const n = nodeByIdRef.current.get(nid);
            if (!n) return;
            if (typeof n.x === "number" && typeof n.y === "number") {
                n.x += dx * 0.3;
                n.y += dy * 0.3;
            }
        });

        if (simulationRef.current) {
            simulationRef.current.alphaTarget(0.25);
        }
    }

    function handlePointerUp() {
        const dragState = dragStateRef.current;
        if (!dragState) return;

        const { nodeId } = dragState;
        const node = nodeByIdRef.current.get(nodeId);
        if (node) {
            node.fx = null;
            node.fy = null;
        }

        dragStateRef.current = null;

        if (simulationRef.current) {
            simulationRef.current.alphaTarget(0.1);
        }
    }

    // 8) Hover simples p/ foco quando não está arrastando

    function handleNodePointerEnter(nodeId: string) {
        const dragState = dragStateRef.current;
        if (dragState && dragState.nodeId === nodeId) return;
        setFocusNodeId(nodeId);
    }

    function handleNodePointerLeave(nodeId: string) {
        const dragState = dragStateRef.current;
        if (dragState && dragState.nodeId === nodeId) return;
        setFocusNodeId(null);
    }

    // 9) Opacidade para nós e arestas

    function getNodeOpacity(id: string): number {
        if (!focusNodeId) return 1;

        const d = distanceById[id];
        if (d === undefined) {
            return 0.12;
        }
        return opacityForDistance(d);
    }

    function getLinkOpacity(l: SimLink): number {
        if (!focusNodeId) return 0.6;

        const source = l.source as SimNode;
        const target = l.target as SimNode;
        const d1 = source?.id ? distanceById[source.id] : undefined;
        const d2 = target?.id ? distanceById[target.id] : undefined;

        let effective: number;

        if (d1 == null && d2 == null) {
            return 0.08;
        } else if (d1 == null) {
            effective = d2!;
        } else if (d2 == null) {
            effective = d1!;
        } else {
            effective = Math.min(d1, d2);
        }

        return opacityForDistance(effective) * 0.8;
    }

    if (!simNodes.length) {
        return (
            <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
                no nodes to display with current filters
            </div>
        );
    }

    // 10) Renderização em SVG
    return (
        <div className="h-full w-full">
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="overflow-hidden rounded-2xl"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                {/* edges */}
                <g
                    stroke="rgba(148, 163, 184, 0.7)"
                    strokeWidth={displaySettings.edgeWidth}
                >
                    {simLinks.map((l) => {
                        const source = l.source as SimNode;
                        const target = l.target as SimNode;

                        if (
                            typeof source?.x !== "number" ||
                            typeof source?.y !== "number" ||
                            typeof target?.x !== "number" ||
                            typeof target?.y !== "number"
                        ) {
                            return null;
                        }

                        const edgeOpacity = getLinkOpacity(l);

                        return (
                            <line
                                key={l.id}
                                x1={source.x}
                                y1={source.y}
                                x2={target.x}
                                y2={target.y}
                                strokeLinecap="round"
                                opacity={edgeOpacity}
                            />
                        );
                    })}
                </g>

                {/* nodes */}
                <g>
                    {simNodes.map((n) => {
                        if (typeof n.x !== "number" || typeof n.y !== "number") {
                            return null;
                        }

                        const r = getNodeRadius(n, displaySettings.nodeSizeBase);
                        const color = getNodeColor(n.type);
                        const nodeOpacity = getNodeOpacity(n.id);

                        return (
                            <g
                                key={n.id}
                                transform={`translate(${n.x}, ${n.y})`}
                                onPointerDown={(e) => handleNodePointerDown(n.id, e)}
                                onPointerEnter={() => handleNodePointerEnter(n.id)}
                                onPointerLeave={() => handleNodePointerLeave(n.id)}
                                style={{ cursor: "grab" }}
                            >
                                <circle
                                    r={r}
                                    fill={color.fill}
                                    stroke={color.stroke}
                                    strokeWidth={1.2}
                                    opacity={nodeOpacity}
                                />
                                <text
                                    x={0}
                                    y={r + 10}
                                    textAnchor="middle"
                                    className="select-none"
                                    fontSize={10}
                                    fill="rgba(148,163,184,0.95)"
                                    opacity={nodeOpacity}
                                >
                                    {n.label}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

export default GraphVisualization;

// Helpers

function getNodeRadius(node: GraphNode, base: number): number {
    const degree = node.degree ?? 0;
    return base + DEGREE_SIZE_FACTOR * Math.log(1 + degree);
}

function getNodeColor(type: GraphNode["type"]): {
    fill: string;
    stroke: string;
} {
    switch (type) {
        case "EVENT":
            return {
                fill: "rgba(56,189,248,0.2)",
                stroke: "rgba(56,189,248,0.9)",
            }; // sky
        case "CHARACTER":
            return {
                fill: "rgba(52,211,153,0.18)",
                stroke: "rgba(52,211,153,0.9)",
            }; // emerald
        case "LOCATION":
            return {
                fill: "rgba(249,115,22,0.18)",
                stroke: "rgba(249,115,22,0.9)",
            }; // orange
        case "OBJECT":
            return {
                fill: "rgba(244,114,182,0.16)",
                stroke: "rgba(244,114,182,0.9)",
            }; // pink
        default:
            return {
                fill: "rgba(148,163,184,0.2)",
                stroke: "rgba(148,163,184,0.9)",
            };
    }
}

function opacityForDistance(distance: number): number {
    if (distance <= 1) return 1;
    if (distance === 2) return 0.5;
    if (distance === 3) return 0.4;
    return 0.12;
}

function pseudoRandomFromId(id: string): number {
    let h = 0;
    for (let i = 0; i < id.length; i += 1) {
        h = (h * 31 + id.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}
