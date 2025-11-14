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

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;

  displaySettings: DisplaySettingsState;
  setDisplaySettings: React.Dispatch<
    React.SetStateAction<DisplaySettingsState>
  >;

  physicsSettings: PhysicsSettingsState;
  setPhysicsSettings: React.Dispatch<
    React.SetStateAction<PhysicsSettingsState>
  >;

  focusNodeId: string | null;
  setFocusNodeId: (id: string | null) => void;

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

function loadNodePositionsFromStorage(
  storageKey?: string
): NodePositions {
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
  const [graphData, setGraphData] = useState<GraphData | null>(initialData);
  const [viewMode, setViewMode] = useState<ViewMode>("graph");
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [displaySettings, setDisplaySettings] =
    useState<DisplaySettingsState>(defaultDisplaySettings);
  const [physicsSettings, setPhysicsSettings] =
    useState<PhysicsSettingsState>(defaultPhysicsSettings);
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);

  // estado interno real das posições
  const [nodePositionsState, setNodePositionsState] = useState<NodePositions>(
    () => loadNodePositionsFromStorage(storageKey)
  );

  // quando a campanha / storageKey mudam, recarrega posições e dados
  useEffect(() => {
    setGraphData(initialData);
    setFocusNodeId(null);

    const loaded = loadNodePositionsFromStorage(storageKey);
    setNodePositionsState(loaded);
  }, [initialData, storageKey]);

  // setter exposto no contexto que também persiste em localStorage
  const setNodePositions = (positions: NodePositions) => {
    setNodePositionsState(positions);
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(positions));
    } catch {
      // quota, navegação privada, etc. -> ignora e segue.
    }
  };

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
    ]
  );

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
};

export const useGraph = (): GraphContextValue => {
  const ctx = useContext(GraphContext);
  if (!ctx) {
    throw new Error("useGraph must be used within a GraphProvider");
  }
  return ctx;
};
