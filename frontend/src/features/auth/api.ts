import api from "../../lib/apiClient";

export type AuthPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  user?: {
    id: string;
    email: string;
    role: "GM" | "PLAYER" | string;
  };
};

export async function registerUser({ email, password }: AuthPayload) {
  const { data } = await api.post<AuthResponse>("/auth/register", {
    email,
    password,
  });
  return data;
}

export async function loginUser({ email, password }: AuthPayload) {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}
