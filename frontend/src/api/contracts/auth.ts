// Tipos de autenticação — espelham o backend novo (backend/API.md + auth_handler.go).

export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  role?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type RegisterRequest = {
  name?: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

// POST /auth/login e /auth/register respondem { user }.
export type LoginResponse = {
  user: CurrentUser;
};

export type UpdateCurrentUserRequest = {
  name?: string;
  email?: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
