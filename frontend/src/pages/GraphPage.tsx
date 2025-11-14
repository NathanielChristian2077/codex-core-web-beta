import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getCampaign,
  getCampaignGraph,
} from "../features/campaigns/api";

import { adaptCampaignGraphResponse } from "../features/graphs/adapters";
import { GraphProvider, useGraph } from "../features/graphs/GraphContext";
import GraphVisualization from "../features/graphs/GraphVisualization";
import type { GraphData } from "../features/graphs/types";

type GraphPageContentProps = {
  campaignName: string;
};

const GraphPageContent: React.FC<GraphPageContentProps> = ({ campaignName }) => {
  const {
    graphData,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    displaySettings,
    setDisplaySettings,
    physicsSettings,
    setPhysicsSettings,
  } = useGraph();

  const [searchTerm, setSearchTerm] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [displayOpen, setDisplayOpen] = useState(false);
  const [forcesOpen, setForcesOpen] = useState(false);

  React.useEffect(() => {
    if (!graphData) return;
    if (Object.keys(filters.relations).length > 0) return;

    const relationsSet = new Set<string>();
    graphData.links.forEach((l) => relationsSet.add(l.type));

    setFilters((prev) => ({
      ...prev,
      relations: Array.from(relationsSet).reduce((acc, rel) => {
        acc[rel] = true;
        return acc;
      }, {} as Record<string, boolean>),
    }));
  }, [graphData, filters.relations, setFilters]);

  const viewButtonClasses = (mode: "graph" | "timeline") =>
    [
      "pointer-events-auto rounded-full px-3 py-1 text-[11px]",
      "border",
      viewMode === mode
        ? "border-sky-500 bg-slate-900/90 text-slate-50"
        : "border-slate-700 bg-slate-900/40 text-slate-300 hover:border-sky-500 hover:bg-slate-900/80",
    ].join(" ");

  return (
    <div className="flex h-full min-h-screen w-full gap-3 p-4">
      <div className="relative flex-1 min-h-full rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900">
        {/* ÁREA DO GRAFO */}
        <div className="h-full w-full rounded-2xl">
          {graphData && graphData.nodes.length > 0 ? (
            <GraphVisualization />
          ) : (
            <div className="flex h-full items-center justify-center text-[11px] text-slate-500">
              no graph data available for this campaign
            </div>
          )}
        </div>

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
                // lógica real de search virá na GraphVisualization / highlight
              }}
              placeholder="search node…"
              className="h-8 w-52 rounded-md border border-slate-700 bg-slate-900/80 px-2 text-[11px] text-slate-100 outline-none focus:border-sky-500"
            />
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                // reset real de camera/highlight virá depois
              }}
              className="h-8 rounded-md border border-slate-700 bg-slate-900/80 px-3 text-[11px] text-slate-100 hover:border-sky-500"
            >
              reset
            </button>
          </div>

          <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950/80 px-1 py-1 shadow-md backdrop-blur">
            <button
              type="button"
              className={viewButtonClasses("graph")}
              onClick={() => setViewMode("graph")}
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
          <button
            type="button"
            onClick={() => setForcesOpen((v) => !v)}
            className="pointer-events-auto rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-200 shadow-sm backdrop-blur hover:border-emerald-500 hover:bg-slate-900/90"
          >
            Forces
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
              {Object.keys(filters.relations).length === 0 && (
                <span className="text-[11px] text-slate-500">
                  no relations found
                </span>
              )}
              <div className="flex max-h-32 flex-col gap-1 overflow-auto pr-1">
                {Object.keys(filters.relations).map((rel) => (
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
          <div className="pointer-events-auto absolute bottom-16 left-72 z-30 w-72 rounded-xl border border-slate-800 bg-slate-950/95 p-3 text-[11px] text-slate-100 shadow-xl backdrop-blur">
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

            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-300">
                  hide orphan nodes
                </span>
                <input
                  type="checkbox"
                  className="h-3 w-3 accent-sky-500"
                  checked={filters.hideOrphans}
                  onChange={(e) =>
                    setFilters((prev) => ({
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
                    {displaySettings.nodeSizeBase}
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={40}
                  step={1}
                  value={displaySettings.nodeSizeBase}
                  onChange={(e) =>
                    setDisplaySettings((prev) => ({
                      ...prev,
                      nodeSizeBase: Number(e.target.value),
                    }))
                  }
                  className="h-1 w-full cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">edge width</span>
                  <span className="text-[10px] text-slate-500">
                    {displaySettings.edgeWidth}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={displaySettings.edgeWidth}
                  onChange={(e) =>
                    setDisplaySettings((prev) => ({
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
                  checked={displaySettings.showArrows}
                  onChange={(e) =>
                    setDisplaySettings((prev) => ({
                      ...prev,
                      showArrows: e.target.checked,
                    }))
                  }
                />
              </label>
            </div>
          </div>
        )}

        {/* Forces panel */}
        {forcesOpen && (
          <div className="pointer-events-auto absolute bottom-16 left-[22rem] z-30 w-80 rounded-xl border border-slate-800 bg-slate-950/95 p-3 text-[11px] text-slate-100 shadow-xl backdrop-blur">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide text-slate-300">
                Forces
              </span>
              <button
                type="button"
                className="text-[10px] text-slate-500 hover:text-slate-300"
                onClick={() => setForcesOpen(false)}
              >
                close
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                global physics
              </h3>

              {/* Link distance */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">
                    link distance
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {physicsSettings.linkDistance}
                  </span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={320}
                  step={10}
                  value={physicsSettings.linkDistance}
                  onChange={(e) =>
                    setPhysicsSettings((prev) => ({
                      ...prev,
                      linkDistance: Number(e.target.value),
                    }))
                  }
                  className="h-1 w-full cursor-pointer"
                />
              </div>

              {/* Link strength */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">
                    link strength
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {physicsSettings.linkStrength.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={physicsSettings.linkStrength}
                  onChange={(e) =>
                    setPhysicsSettings((prev) => ({
                      ...prev,
                      linkStrength: Number(e.target.value),
                    }))
                  }
                  className="h-1 w-full cursor-pointer"
                />
              </div>

              {/* Charge strength */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">
                    charge strength
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {physicsSettings.chargeStrength}
                  </span>
                </div>
                <input
                  type="range"
                  min={-600}
                  max={-50}
                  step={10}
                  value={physicsSettings.chargeStrength}
                  onChange={(e) =>
                    setPhysicsSettings((prev) => ({
                      ...prev,
                      chargeStrength: Number(e.target.value),
                    }))
                  }
                  className="h-1 w-full cursor-pointer"
                />
              </div>

              {/* Center strength */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">
                    center strength
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {physicsSettings.centerStrength.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={physicsSettings.centerStrength}
                  onChange={(e) =>
                    setPhysicsSettings((prev) => ({
                      ...prev,
                      centerStrength: Number(e.target.value),
                    }))
                  }
                  className="h-1 w-full cursor-pointer"
                />
              </div>

              {/* Collision radius */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-300">
                    collision radius
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {physicsSettings.collisionRadius}
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={2}
                  value={physicsSettings.collisionRadius}
                  onChange={(e) =>
                    setPhysicsSettings((prev) => ({
                      ...prev,
                      collisionRadius: Number(e.target.value),
                    }))
                  }
                  className="h-1 w-full cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const GraphPage: React.FC = () => {
  const { id: campaignId } = useParams<{ id: string }>();

  const [campaignName, setCampaignName] = useState<string>("");
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const adapted = adaptCampaignGraphResponse(graph);
        setGraphData(adapted);
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

  return (
    <GraphProvider initialData={graphData}
      storageKey={
        campaignId ? `campaign:${campaignId}:graph-positions` : undefined
      }
    >
      <GraphPageContent campaignName={campaignName} />
    </GraphProvider>
  );
};

export default GraphPage;
