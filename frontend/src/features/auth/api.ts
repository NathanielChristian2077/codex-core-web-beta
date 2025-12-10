import api from "../../lib/apiClient";

export type AuthPayload = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  role: "GM" | "PLAYER" | string;
};

export async function registerUser(payload: AuthPayload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export async function loginUser(payload: AuthPayload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function fetchSession() {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export async function logoutUser() {
  await api.post("/auth/logout");
}
