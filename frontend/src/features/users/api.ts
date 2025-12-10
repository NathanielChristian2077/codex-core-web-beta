import api from "../../lib/apiClient";

export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
  avatarUrl?: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  const { data } = await api.get<CurrentUser>("/auth/me");
  return data;
}

export async function updateCurrentUser(payload: {
  name?: string;
  email?: string;
}) {
  const { data } = await api.patch<CurrentUser>("/auth/me", payload);
  return data;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  await api.patch("/auth/me/password", payload);
}

export async function deleteCurrentUser() {
  await api.delete("/auth/me");
}
