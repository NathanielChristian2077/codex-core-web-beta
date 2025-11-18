export type GraphLayoutMode = "chaos" | "flow" | "theatre";

export type GraphLayoutConfig = {
  mode: GraphLayoutMode;
  
  chaos?: {
    chargeMultiplier?: number;
  };
  flow?: {
    xStrength?: number;
    yStrength?: number;
  };
  theatre?: {
    levelGap?: number;
  };
};
