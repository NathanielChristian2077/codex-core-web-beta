// Wrapper de compatibilidade: mantém os nomes antigos usados pela UI,
// mas delega tudo para a camada de API nova (cookie HttpOnly + CSRF).
import * as authApi from "../../api/modules/auth";
import type {
  CurrentUser,
  LoginRequest,
  RegisterRequest,
} from "../../api/contracts/auth";

export type AuthPayload = LoginRequest;
export type User = CurrentUser;

export async function registerUser(
  payload: RegisterRequest
): Promise<CurrentUser> {
  return authApi.register(payload);
}

export async function loginUser(payload: LoginRequest): Promise<CurrentUser> {
  return authApi.login(payload);
}

export async function fetchSession(): Promise<CurrentUser> {
  return authApi.me();
}

export async function logoutUser(): Promise<void> {
  return authApi.logout();
}
