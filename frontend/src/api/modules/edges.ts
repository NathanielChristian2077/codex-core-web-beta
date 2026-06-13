import api from "../client";
import type {
  CreateEdgeRequest,
  EdgeDto,
  GraphResponse,
  UpdateEdgeRequest,
} from "../contracts/edge";

export async function listEdges(projectId: string): Promise<EdgeDto[]> {
  const { data } = await api.get<EdgeDto[]>(`/projects/${projectId}/edges`);
  return data;
}

export async function createEdge(
  projectId: string,
  payload: CreateEdgeRequest
): Promise<EdgeDto> {
  const { data } = await api.post<EdgeDto>(
    `/projects/${projectId}/edges`,
    payload
  );
  return data;
}

export async function updateEdge(
  edgeId: string,
  payload: UpdateEdgeRequest
): Promise<EdgeDto> {
  const { data } = await api.patch<EdgeDto>(`/edges/${edgeId}`, payload);
  return data;
}

export async function deleteEdge(edgeId: string): Promise<void> {
  await api.delete(`/edges/${edgeId}`);
}

export async function getGraph(projectId: string): Promise<GraphResponse> {
  const { data } = await api.get<GraphResponse>(`/projects/${projectId}/graph`);
  return data;
}
