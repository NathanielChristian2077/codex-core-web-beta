// Wrapper de compatibilidade sobre a camada de API nova.
import * as authApi from "../../api/modules/auth";
import type { CurrentUser } from "../../api/contracts/auth";

export type { CurrentUser };

export function getCurrentUser(): Promise<CurrentUser> {
  return authApi.me();
}

export function updateCurrentUser(payload: {
  name?: string;
  email?: string;
}): Promise<CurrentUser> {
  return authApi.updateMe(payload);
}

export function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  return authApi.changePassword(payload);
}

export function deleteCurrentUser(): Promise<void> {
  return authApi.deleteMe();
}
