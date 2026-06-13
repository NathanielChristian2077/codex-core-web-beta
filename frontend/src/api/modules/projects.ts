import api from "../client";
import type {
  CreateProjectRequest,
  ProjectDto,
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
