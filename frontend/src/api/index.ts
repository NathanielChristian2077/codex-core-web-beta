// Ponto de entrada da camada de API nova (backend Project/Node/Edge).
// Uso: import { authApi, projectsApi } from "@/api";

export { default as apiClient } from "./client";

export * as authApi from "./modules/auth";
export * as projectsApi from "./modules/projects";
export * as nodesApi from "./modules/nodes";
export * as nodeTypesApi from "./modules/nodeTypes";
export * as edgesApi from "./modules/edges";
export * as edgeTypesApi from "./modules/edgeTypes";
export * as viewsApi from "./modules/views";
export * as layoutsApi from "./modules/layouts";

export * from "./contracts";
