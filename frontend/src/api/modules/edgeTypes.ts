import api from "../client";
import type { CreateEdgeTypeRequest, EdgeTypeDto } from "../contracts/edge";

export async function listEdgeTypes(projectId: string): Promise<EdgeTypeDto[]> {
  const { data } = await api.get<EdgeTypeDto[]>(
    `/projects/${projectId}/edge-types`
  );
  return data;
}

export async function createEdgeType(
  projectId: string,
  payload: CreateEdgeTypeRequest
): Promise<EdgeTypeDto> {
  const { data } = await api.post<EdgeTypeDto>(
    `/projects/${projectId}/edge-types`,
    payload
  );
  return data;
}

export async function updateEdgeType(
  edgeTypeId: string,
  payload: Partial<CreateEdgeTypeRequest>
): Promise<EdgeTypeDto> {
  const { data } = await api.patch<EdgeTypeDto>(
    `/edge-types/${edgeTypeId}`,
    payload
  );
  return data;
}

export async function deleteEdgeType(edgeTypeId: string): Promise<void> {
  await api.delete(`/edge-types/${edgeTypeId}`);
}
