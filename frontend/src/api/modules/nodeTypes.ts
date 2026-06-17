import api from "../client";
import type { CreateNodeTypeRequest, NodeTypeDto } from "../contracts/node";

export async function listNodeTypes(projectId: string): Promise<NodeTypeDto[]> {
  const { data } = await api.get<NodeTypeDto[]>(
    `/projects/${projectId}/node-types`
  );
  return data;
}

export async function createNodeType(
  projectId: string,
  payload: CreateNodeTypeRequest
): Promise<NodeTypeDto> {
  const { data } = await api.post<NodeTypeDto>(
    `/projects/${projectId}/node-types`,
    payload
  );
  return data;
}

export async function updateNodeType(
  nodeTypeId: string,
  payload: Partial<CreateNodeTypeRequest>
): Promise<NodeTypeDto> {
  const { data } = await api.patch<NodeTypeDto>(
    `/node-types/${nodeTypeId}`,
    payload
  );
  return data;
}

export async function deleteNodeType(nodeTypeId: string): Promise<void> {
  await api.delete(`/node-types/${nodeTypeId}`);
}
