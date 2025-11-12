import api from "../../lib/apiClient";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser({ name, email, password }: RegisterPayload) {
  const { data } = await api.post("/auth/register", { name, email, password: password });
  return data;
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  const { data } = await api.post("/auth/login", { email, password: password });
  return data as { accessToken: string };
}
