import api from "../client";
import type {
  ChangePasswordRequest,
  CurrentUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateCurrentUserRequest,
} from "../contracts/auth";

// Pega/renova o cookie XSRF-TOKEN. O client já chama isso sozinho quando
// precisa, mas fica exposto caso a UI queira "esquentar" o CSRF.
export async function getCsrf(): Promise<void> {
  await api.get("/auth/csrf");
}

export async function register(payload: RegisterRequest): Promise<CurrentUser> {
  const { data } = await api.post<LoginResponse>("/auth/register", payload);
  return data.user;
}

export async function login(payload: LoginRequest): Promise<CurrentUser> {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data.user;
}

// GET /auth/me devolve o usuário cru (sem wrapper { user }).
export async function me(): Promise<CurrentUser> {
  const { data } = await api.get<CurrentUser>("/auth/me");
  return data;
}

export async function updateMe(
  payload: UpdateCurrentUserRequest
): Promise<CurrentUser> {
  const { data } = await api.patch<CurrentUser>("/auth/me", payload);
  return data;
}

export async function changePassword(
  payload: ChangePasswordRequest
): Promise<void> {
  await api.patch("/auth/me/password", payload);
}

export async function deleteMe(): Promise<void> {
  await api.delete("/auth/me");
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
