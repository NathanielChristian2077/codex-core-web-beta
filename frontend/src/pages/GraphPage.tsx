import type Cytoscape from "cytoscape";
import React, { useEffect, useMemo, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { useParams } from "react-router-dom";
import {
  getCampaign,
  getCampaignGraph,
  type CampaignGraphResponse,
  type GraphEdgeDto,
  type GraphNodeDto,
} from "../features/campaigns/api";

type TooltipState = {
  visible: boolean;
  x: number;
  y: number;
  title: string;
  description?: string | null;
};

type ViewMode = "default" | "timeline";

const adaptGraphToElements = (
  data: CampaignGraphResponse
): Cytoscape.ElementDefinition[] => {
  const nodes: Cytoscape.ElementDefinition[] = data.nodes.map(
    (n: GraphNodeDto) => ({
      data: {
        id: n.id,
        label: n.label,
        type: n.type,
        description: n.description ?? "",
      },
      classes: ["node-base"],
    })
  );

  const edges: Cytoscape.ElementDefinition[] = data.edges.map(
    (e: GraphEdgeDto) => ({
      data: {
        id: e.id,
        source: e.from.id,
        target: e.to.id,
        label: e.kind,
        type: e.kind,
      },
      classes: ["edge-base"],
    })
  );

  return [...nodes, ...edges];
};

export const GraphPage: React.FC = () => {
  const { id: campaignId } = useParams<{ id: string }>();

  const [campaignName, setCampaignName] = useState<string>("");
  const [elements, setElements] = useState<Cytoscape.ElementDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    types: {
      EVENT: true,
      CHARACTER: true,
      LOCATION: true,
      OBJECT: true,
    } as Record<"EVENT" | "CHARACTER" | "LOCATION" | "OBJECT", boolean>,
    relations: {} as Record<string, boolean>,
  });

  const [settings, setSettings] = useState({
    hideOrphans: false,
    nodeSize: 18,
    edgeWidth: 2,
    showArrows: true,
  });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [displayOpen, setDisplayOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("default");

  const cyRef = useRef<Cytoscape.Core | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    title: "",
    description: "",
  });

  useEffect(() => {
    if (!campaignId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [graph, campaign] = await Promise.all([
          getCampaignGraph(campaignId),
          getCampaign(campaignId),
        ]);

        setCampaignName(campaign.name ?? "");
        const cyElements = adaptGraphToElements(graph);
        setElements(cyElements);

        const relationTypes = new Set<string>();
        graph.edges.forEach((e) => relationTypes.add(e.kind));

        setFilters((prev) => ({
          ...prev,
          relations: Array.from(relationTypes).reduce((acc, rel) => {
            acc[rel] = true;
            return acc;
          }, {} as Record<string, boolean>),
        }));
      } catch (err: any) {
        console.error(err);
        setError(
          err?.response?.data?.message ??
          err?.message ??
          "Unexpected error while loading graph"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [campaignId]);

  const { edgeWidth, showArrows } = settings;

  const stylesheet = useMemo(
    () => [
      {
        selector: "node",
        style: {
          shape: "ellipse",
          "background-color": "#111827",
          "border-width": 1.5,
          "border-color": "#9ca3af",
          label: "data(label)",
          "text-valign": "center",
          "text-halign": "center",
          "font-size": 10,
          color: "#e5e7eb",
          "text-wrap": "wrap",
          "text-max-width": 120,
        },
      },
      {
        selector: "edge",
        style: {
          width: edgeWidth,
          "line-color": "#4b5563",
          "target-arrow-color": "#4b5563",
          "target-arrow-shape": "none",
          "curve-style": "bezier",
        },
      },
      {
        selector: 'edge[type = "PREVIOUS"], edge[type = "NEXT"]',
        style: {
          "target-arrow-shape": showArrows ? "triangle" : "none",
        },
      },
      {
        selector: ".hidden",
        style: {
          display: "none",
        },
      },
      {
        selector: ".dimmed",
        style: {
          opacity: 0.12,
        },
      },
      {
        selector: ".highlighted",
        style: {
          "border-color": "#f97316",
          "border-width": 3,
          "line-color": "#f97316",
          "target-arrow-color": "#f97316",
        },
      },
    ],
    [edgeWidth, showArrows]
  );

  const applyFilters = () => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().removeClass("hidden").removeClass("dimmed");

    cy.nodes().forEach((n) => {
      const type = n.data("type") as
        | "EVENT"
        | "CHARACTER"
        | "LOCATION"
        | "OBJECT"
        | undefined;
      if (!type) return;

      if (!filters.types[type]) {
        n.addClass("hidden");
        return;
      }

      if (settings.hideOrphans && n.connectedEdges().length === 0) {
        n.addClass("hidden");
      }
    });

    cy.edges().forEach((e) => {
      const relType = e.data("type") as string | undefined;
      if (!relType) return;
      if (filters.relations && filters.relations[relType] === false) {
        e.addClass("hidden");
      }
    });
  };

  const applyViewLayout = (mode: ViewMode) => {
    const cy = cyRef.current;
    if (!cy) return;
    if (cy.nodes().length === 0) return;

    if (mode === "default") {
      cy.layout({
        name: "cose",
        animate: false,
        fit: true,
        padding: 60,
        randomize: true,
      }).run();
      return;
    }

    // timeline mode
    const events = cy.nodes('[type = "EVENT"]');
    const others = cy.nodes().not('[type = "EVENT"]');

    const spacingX = 220;
    const baseX = 120;
    const centerY = (cy.height() || 600) / 2;

    events.forEach((node, index) => {
      const jitterY = (Math.random() - 0.5) * 140;
      node.position({
        x: baseX + index * spacingX,
        y: centerY + jitterY,
      });
      node.unlock();
    });

    // soltar os outros em volta, sem refazer tudo
    others.layout({
      name: "cose",
      animate: true,
      fit: false,
      padding: 40,
      randomize: true,
    }).run();

    cy.animate({
      fit: { eles: cy.elements(), padding: 100 },
      duration: 400,
    });
  };

  useEffect(() => {
    applyFilters();
    // após filtros, recalcular tamanho
    const cy = cyRef.current;
    if (!cy) return;

    const base = settings.nodeSize;
    const factor = 4;

    cy.nodes().forEach((n) => {
      const degree = n.connectedEdges().length;
      const size = base + factor * Math.log(1 + degree);
      n.style("width", size);
      n.style("height", size);
    });
  }, [filters, elements, settings.nodeSize, settings.hideOrphans]);

  useEffect(() => {
    if (!elements.length) return;
    applyViewLayout(viewMode);
  }, [viewMode, elements.length]);

  const handleSearch = (term: string) => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().removeClass("highlighted").removeClass("dimmed");

    const trimmed = term.trim();
    if (!trimmed) {
      cy.fit(undefined, 60);
      return;
    }

    const lower = trimmed.toLowerCase();

    const matches = cy.nodes().filter((n) => {
      const label: string = n.data("label") ?? "";
      return label.toLowerCase().includes(lower);
    });

    if (matches.nonempty()) {
      cy.elements().addClass("dimmed");
      matches.removeClass("dimmed").addClass("highlighted");

      cy.animate({
        fit: { eles: matches, padding: 100 },
        duration: 300,
      });
    }
  };

  const handleCyReady = (cy: Cytoscape.Core) => {
    cyRef.current = cy;

    cy.elements().removeClass("hidden").removeClass("dimmed").removeClass("highlighted");

    // click: just highlight neighborhood, no dim/fit
    cy.on("tap", "node", (event) => {
      const node = event.target as Cytoscape.NodeSingular;
      const neighborhood = node.closedNeighborhood();

      // clear previous highlight
      cy.elements().removeClass("highlighted");

      // highlight node + neighbors
      neighborhood.addClass("highlighted");
    });

    // hover: ONLY tooltip
    cy.on("mouseover", "node", (event) => {
      const node = event.target as Cytoscape.NodeSingular;
      const data = node.data() as { label: string; description?: string };

      const pos = node.renderedPosition();
      const rect = containerRef.current?.getBoundingClientRect();

      const x = rect ? rect.left + pos.x : pos.x;
      const y = rect ? rect.top + pos.y : pos.y;

      setTooltip({
        visible: true,
        x,
        y,
        title: data.label,
        description: data.description,
      });
    });

    cy.on("mouseout", "node", () => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    });

    // drag behavior: move neighborhood together
    cy.on("grab", "node", (event) => {
      const node = event.target as Cytoscape.NodeSingular;
      node.scratch("_dragStart", { ...node.position() });
    });

    cy.on("dragfree", "node", (event) => {
      const node = event.target as Cytoscape.NodeSingular;
      const start = node.scratch("_dragStart") as { x: number; y: number } | undefined;
      if (!start) return;

      const end = node.position();
      const dx = end.x - start.x;
      const dy = end.y - start.y;

      const neighbors = node
        .closedNeighborhood()
        .nodes()
        .filter((n) => n.id() !== node.id());

      neighbors.forEach((n) => {
        const pos = n.position();
        n.position({ x: pos.x + dx, y: pos.y + dy });
      });

      node.removeScratch("_dragStart");
    });

    applyFilters();
    applyViewLayout(viewMode);

    const base = settings.nodeSize;
    const factor = 4;
    cy.nodes().forEach((n) => {
      const degree = n.connectedEdges().length;
      const size = base + factor * Math.log(1 + degree);
      n.style("width", size);
      n.style("height", size);
    });
  };


  const handleResetView = () => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().removeClass("highlighted").removeClass("dimmed");
    applyViewLayout(viewMode);
  };

  const relationTypes = useMemo(() => {
    const set = new Set<string>();
    elements.forEach((el) => {
      const data: any = el.data;
      if (data && typeof data.type === "string") {
        set.add(data.type);
      }
    });
    return Array.from(set).sort();
  }, [elements]);

  useEffect(() => {
    if (relationTypes.length === 0) return;
    if (Object.keys(filters.relations || {}).length > 0) return;

    setFilters((prev) => ({
      ...prev,
      relations: relationTypes.reduce((acc, rel) => {
        acc[rel] = true;
        return acc;
      }, {} as Record<string, boolean>),
    }));
  }, [relationTypes]);

  if (loading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center text-sm text-slate-400">
        loading your node multiverse…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-screen flex-col items-center justify-center gap-2">
        <span className="text-sm text-red-400">failed to load graph</span>
        <span className="text-xs text-slate-400">{error}</span>
      </div>
    );
  }

  const viewButtonClasses = (mode: ViewMode) =>
    [
      "pointer-events-auto rounded-full px-3 py-1 text-[11px]",
      "border",
      viewMode === mode
        ? "border-sky-500 bg-slate-900/90 text-slate-50"
        : "border-slate-700 bg-slate-900/40 text-slate-300 hover:border-sky-500 hover:bg-slate-900/80",
    ].join(" ");

  return (
    <div className="flex h-full min-h-screen w-full gap-3 p-4">
      <div
        className="relative flex-1 min-h-full rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900"
        ref={containerRef}
      >
        <CytoscapeComponent
          elements={elements}
          cy={handleCyReady}
          layout={{ name: "preset" }} // layout real controlado via applyViewLayout
          stylesheet={stylesheet as any}
          style={{ width: "100%", height: "100%" }}
        />

        {/* Header / campaign info */}
        <div className="pointer-events-none absolute left-4 top-4 z-20 max-w-xs rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 shadow-lg backdrop-blur">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-sky-500/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-950">
              Graph
            </span>
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
          </div>
          <div className="truncate text-sm font-medium text-slate-50">
            {campaignName || "Campaign graph"}
          </div>
          <div className="text-[11px] text-slate-400">
            relations between events, characters, locations and objects
          </div>
        </div>

        {/* Search + view mode */}
        <div className="pointer-events-none absolute right-4 top-4 z-20 flex flex-col items-end gap-2 text-xs text-slate-100">
          <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/85 px-3 py-2 shadow-lg backdrop-blur">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                handleSearch(value);
              }}
              placeholder="search node…"
              className="h-8 w-52 rounded-md border border-slate-700 bg-slate-900/80 px-2 text-[11px] text-slate-100 outline-none focus:border-sky-500"
            />
            <button
              type="button"
              onClick={handleResetView}
              className="h-8 rounded-md border border-slate-700 bg-slate-900/80 px-3 text-[11px] text-slate-100 hover:border-sky-500"
            >
              reset
            </button>
          </div>

          <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/80 px-1 py-1 shadow-md backdrop-blur">
            <button
              type="button"
              className={viewButtonClasses("default")}
              onClick={() => setViewMode("default")}
            >
              Graph
            </button>
            <button
              type="button"
              className={viewButtonClasses("timeline")}
              onClick={() => setViewMode("timeline")}
            >
              Timeline
            </button>
          </div>
        </div>

        {/* Floating controls buttons */}
        <div className="pointer-events-none absolute bottom-4 left-4 z-20 flex gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="pointer-events-auto rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-200 shadow-sm backdrop-blur hover:border-sky-500 hover:bg-slate-900/90"
          >
            Filters
          </button>
          <button
            type="button"
            onClick={() => setDisplayOpen((v) => !v)}
            className="pointer-events-auto rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-200 shadow-sm backdrop-blur hover:border-sky-500 hover:bg-slate-900/90"
          >
            Display
          </button>
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <div className="pointer-events-auto absolute bottom-16 left-4 z-30 w-64 rounded-xl border border-slate-800 bg-slate-950/95 p-3 text-[11px] text-slate-100 shadow-xl backdrop-blur">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide text-slate-300">
                Filters
              </span>
              <button
                type="button"
                className="text-[10px] text-slate-500 hover:text-slate-300"
                onClick={() => setFiltersOpen(false)}
              >
                close
              </button>
            </div>

            <div className="mb-3">
              <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                node types
              </h3>
              <div className="flex flex-col gap-1">
                {(["EVENT", "CHARACTER", "LOCATION", "OBJECT"] as const).map(
                  (t) => (
                    <label key={t} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-3 w-3 accent-sky-500"
                        checked={filters.types[t]}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFilters((prev) => ({
                            ...prev,
                            types: { ...prev.types, [t]: checked },
                          }));
                        }}
                      />
                      <span className="capitalize text-[11px] text-slate-300">
                        {t.toLowerCase()}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                relation types
              </h3>
              {relationTypes.length === 0 && (
                <span className="text-[11px] text-slate-500">
                  no relations found
                </span>
              )}
              <div className="flex max-h-32 flex-col gap-1 overflow-auto pr-1">
                {relationTypes.map((rel) => (
                  <label key={rel} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-3 w-3 accent-sky-500"
                      checked={filters.relations[rel] ?? true}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFilters((prev) => ({
                          ...prev,
                          relations: { ...prev.relations, [rel]: checked },
                        }));
                      }}
                    />
                    <span className="truncate text-[11px] text-slate-300">
                      {rel}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Display panel */}
        {displayOpen && (
          <div className="pointer-events-auto absolute bottom-16 left-72 z-30 w-64 rounded-xl border border-slate-800 bg-slate-950/95 p-3 text-[11px] text-slate-100 shadow-xl backdrop-blur">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide text-slate-300">
                Display
              </span>
              <button
                type="button"
                className="text-[10px] text-slate-500 hover:text-slate-300"
                onClick={() => setDisplayOpen(false)}
              >
                close
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-300">
                  hide orphan nodes
                </span>
                <input
                  type="checkbox"
                  className="h-3 w-3 accent-sky-500"
                  checked={settings.hideOrphans}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      hideOrphans: e.target.checked,
                    }))
                  }
                />
              </label>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">node size</span>
                  <span className="text-[10px] text-slate-500">
                    {settings.nodeSize}
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={40}
                  step={1}
                  value={settings.nodeSize}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      nodeSize: Number(e.target.value),
                    }))
                  }
                  className="h-1 w-full cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">
                    edge width
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {settings.edgeWidth}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={settings.edgeWidth}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      edgeWidth: Number(e.target.value),
                    }))
                  }
                  className="h-1 w-full cursor-pointer"
                />
              </div>

              <label className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-300">show arrows</span>
                <input
                  type="checkbox"
                  className="h-3 w-3 accent-sky-500"
                  checked={settings.showArrows}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      showArrows: e.target.checked,
                    }))
                  }
                />
              </label>
            </div>
          </div>
        )}

        {tooltip.visible && (
          <div
            className="pointer-events-none absolute z-30 max-w-xs rounded-md border border-slate-700 bg-slate-900/95 p-2 text-[11px] text-slate-100 shadow-lg"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div className="mb-1 font-semibold">{tooltip.title}</div>
            {tooltip.description && (
              <div className="whitespace-pre-wrap text-[11px] text-slate-300">
                {tooltip.description}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphPage;
