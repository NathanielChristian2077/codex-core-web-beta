import api from "../client";
import type {
  CreateProjectRequest,
  ProjectDto,
  ProjectExport,
  UpdateProjectRequest,
} from "../contracts/project";

export async function listProjects(): Promise<ProjectDto[]> {
  const { data } = await api.get<ProjectDto[]>("/projects");
  return data;
}

export async function getProject(id: string): Promise<ProjectDto> {
  const { data } = await api.get<ProjectDto>(`/projects/${id}`);
  return data;
}

export async function createProject(
  payload: CreateProjectRequest
): Promise<ProjectDto> {
  const { data } = await api.post<ProjectDto>("/projects", payload);
  return data;
}

export async function updateProject(
  id: string,
  payload: UpdateProjectRequest
): Promise<ProjectDto> {
  const { data } = await api.patch<ProjectDto>(`/projects/${id}`, payload);
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}

// O backend faz a cópia profunda (nodes, edges, layout) e devolve o projeto novo.
export async function duplicateProject(id: string): Promise<ProjectDto> {
  const { data } = await api.post<ProjectDto>(`/projects/${id}/duplicate`);
  return data;
}

// Retorna o snapshot completo do projeto; o front só baixa o JSON.
export async function exportProject(id: string): Promise<ProjectExport> {
  const { data } = await api.get<ProjectExport>(`/projects/${id}/export`);
  return data;
}

// Recebe um snapshot de /export e recria o projeto no backend.
export async function importProject(
  payload: ProjectExport
): Promise<ProjectDto> {
  const { data } = await api.post<ProjectDto>("/projects/import", payload);
  return data;
}
