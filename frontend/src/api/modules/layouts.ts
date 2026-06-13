import api from "../client";
import type { LayoutDto, UpsertLayoutRequest } from "../contracts/view";

export async function getViewLayout(viewId: string): Promise<LayoutDto[]> {
  const { data } = await api.get<LayoutDto[]>(`/views/${viewId}/layout`);
  return data;
}

export async function updateNodeLayout(
  viewId: string,
  payload: UpsertLayoutRequest
): Promise<LayoutDto> {
  const { data } = await api.put<LayoutDto>(
    `/views/${viewId}/layout/nodes/${payload.nodeId}`,
    payload
  );
  return data;
}
