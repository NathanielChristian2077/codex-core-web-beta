import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GraphData, GraphNodeType } from "./types";

type ViewMode = "graph" | "timeline";

type FiltersState = {
  types: Record<GraphNodeType, boolean>;
  relations: Record<string, boolean>;
  hideOrphans: boolean;
};

type DisplaySettingsState = {
  nodeSizeBase: number;
  edgeWidth: number;
  showArrows: boolean;
  autoZoomOnClick: boolean;
};

type PhysicsSettingsState = {
  linkDistance: number;
  linkStrength: number;
  chargeStrength: number;
  centerStrength: number;
  collisionRadius: number;
};

type NodePositions = Record<string, { x: number; y: number }>;

export type GraphContextValue = {
  graphData: GraphData | null;
  setGraphDataFromOutside: (data: GraphData | null) => void;

  /** current view mode */
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  /** filtering rules for nodes and relations */
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;

  /** visual styling (node size, edge width, arrows) */
  displaySettings: DisplaySettingsState;
  setDisplaySettings: React.Dispatch<
    React.SetStateAction<DisplaySettingsState>
  >;

  /** physics configuration for d3-force */
  physicsSettings: PhysicsSettingsState;
  setPhysicsSettings: React.Dispatch<
    React.SetStateAction<PhysicsSettingsState>
  >;

  /** hovered or focused node */
  focusNodeId: string | null;
  setFocusNodeId: (id: string | null) => void;

  /** double-click selected node */
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  /** right-click selected node */
  editingNodeId: string | null;
  setEditingNodeId: (id: string | null) => void;

  /** stored node positions (persistent) */
  nodePositions: NodePositions;
  setNodePositions: (positions: NodePositions) => void;
};

const defaultFilters: FiltersState = {
  types: {
    EVENT: true,
    CHARACTER: true,
    LOCATION: true,
    OBJECT: true,
  },
  relations: {},
  hideOrphans: false,
};

const defaultDisplaySettings: DisplaySettingsState = {
  nodeSizeBase: 18,
  edgeWidth: 2,
  showArrows: true,
  autoZoomOnClick: true,
};

const defaultPhysicsSettings: PhysicsSettingsState = {
  linkDistance: 160,
  linkStrength: 0.8,
  chargeStrength: -200,
  centerStrength: 0.5,
  collisionRadius: 18,
};

const GraphContext = createContext<GraphContextValue | undefined>(undefined);

type GraphProviderProps = {
  initialData: GraphData | null;
  storageKey?: string;
  children: ReactNode;
};

/** Safely load saved node positions from localStorage */
function loadNodePositionsFromStorage(storageKey?: string): NodePositions {
  if (!storageKey) return {};
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as NodePositions;
  } catch {
    return {};
  }
}

export const GraphProvider: React.FC<GraphProviderProps> = ({
  initialData,
  storageKey,
  children,
}) => {
  /** core graph data */
  const [graphData, setGraphData] = useState<GraphData | null>(initialData);

  /** view mode: "graph" | "timeline" */
  const [viewMode, setViewMode] = useState<ViewMode>("graph");

  /** UI filters */
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);

  /** display settings (visual only) */
  const [displaySettings, setDisplaySettings] =
    useState<DisplaySettingsState>(defaultDisplaySettings);

  /** physics forces for d3-force */
  const [physicsSettings, setPhysicsSettings] =
    useState<PhysicsSettingsState>(defaultPhysicsSettings);

  /** currently double-click selected node */
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  /** hovered/pointed node (used for highlight waves) */
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);

  /** currently right-click selected node */
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  /** internal real node positions */
  const [nodePositionsState, setNodePositionsState] = useState<NodePositions>(
    () => loadNodePositionsFromStorage(storageKey)
  );

  /** reload positions when campaign or storage key changes */
  useEffect(() => {
    setGraphData(initialData);
    setFocusNodeId(null);

    const loaded = loadNodePositionsFromStorage(storageKey);
    setNodePositionsState(loaded);
  }, [initialData, storageKey]);

  /** setter that also persists to localStorage */
  const setNodePositions = (positions: NodePositions) => {
    setNodePositionsState(positions);
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(positions));
    } catch {
      /* ignore write errors */
    }
  };

  /** memoized context value to avoid re-renders */
  const value = useMemo<GraphContextValue>(
    () => ({
      graphData,
      setGraphDataFromOutside: setGraphData,

      viewMode,
      setViewMode,

      filters,
      setFilters,

      displaySettings,
      setDisplaySettings,

      physicsSettings,
      setPhysicsSettings,

      focusNodeId,
      setFocusNodeId,

      selectedNodeId,
      setSelectedNodeId,

      editingNodeId,
      setEditingNodeId,

      nodePositions: nodePositionsState,
      setNodePositions,
    }),
    [
      graphData,
      viewMode,
      filters,
      displaySettings,
      physicsSettings,
      focusNodeId,
      nodePositionsState,
      selectedNodeId,
      editingNodeId,
    ]
  );

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
};

/** hook for accessing graph context safely */
export const useGraph = (): GraphContextValue => {
  const ctx = useContext(GraphContext);
  if (!ctx) {
    throw new Error("useGraph must be used within a GraphProvider");
  }
  return ctx;
};
