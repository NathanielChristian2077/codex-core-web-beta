import api from "../client";
import type {
  CreateNodeRequest,
  NodeDto,
  NodeFilters,
  UpdateNodeRequest,
} from "../contracts/node";

export async function listNodes(
  projectId: string,
  filters: NodeFilters = {}
): Promise<NodeDto[]> {
  const { data } = await api.get<NodeDto[]>(`/projects/${projectId}/nodes`, {
    params: {
      typeId: filters.typeId,
      typeSlug: filters.typeSlug,
      search: filters.search,
    },
  });
  return data;
}

export async function getNode(nodeId: string): Promise<NodeDto> {
  const { data } = await api.get<NodeDto>(`/nodes/${nodeId}`);
  return data;
}

export async function createNode(
  projectId: string,
  payload: CreateNodeRequest
): Promise<NodeDto> {
  const { data } = await api.post<NodeDto>(
    `/projects/${projectId}/nodes`,
    payload
  );
  return data;
}

export async function updateNode(
  nodeId: string,
  payload: UpdateNodeRequest
): Promise<NodeDto> {
  const { data } = await api.patch<NodeDto>(`/nodes/${nodeId}`, payload);
  return data;
}

export async function deleteNode(nodeId: string): Promise<void> {
  await api.delete(`/nodes/${nodeId}`);
}
