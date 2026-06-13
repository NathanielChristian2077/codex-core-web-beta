import api from "../client";
import type { CreateViewRequest, ViewDto } from "../contracts/view";

export async function listViews(projectId: string): Promise<ViewDto[]> {
  const { data } = await api.get<ViewDto[]>(`/projects/${projectId}/views`);
  return data;
}

export async function createView(
  projectId: string,
  payload: CreateViewRequest
): Promise<ViewDto> {
  const { data } = await api.post<ViewDto>(
    `/projects/${projectId}/views`,
    payload
  );
  return data;
}

export async function updateView(
  viewId: string,
  payload: Partial<CreateViewRequest>
): Promise<ViewDto> {
  const { data } = await api.patch<ViewDto>(`/views/${viewId}`, payload);
  return data;
}

export async function deleteView(viewId: string): Promise<void> {
  await api.delete(`/views/${viewId}`);
}
