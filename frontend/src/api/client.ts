import axios from "axios";

/**
 * Cliente HTTP central do frontend (backend novo: Project/Node/Edge).
 *
 * Autenticação: cookie HttpOnly de sessão + CSRF.
 * - O cookie de sessão é HttpOnly: o JS NÃO o lê nem o escreve.
 * - O axios envia os cookies automaticamente via `withCredentials: true`.
 * - Em requests mutáveis (POST/PUT/PATCH/DELETE) mandamos o header
 *   `X-CSRF-Token` lido do cookie `XSRF-TOKEN` (não-HttpOnly).
 *
 * Nada de accessToken no localStorage nem Authorization: Bearer.
 */

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function isMutating(method?: string): boolean {
  const m = method?.toUpperCase();
  return m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE";
}

let csrfPrimed = false;

/**
 * Garante que existe um cookie XSRF-TOKEN antes de um request mutável.
 * Numa sessão recém-aberta (refresh com cookie de sessão válido mas sem
 * cookie CSRF) buscamos o token uma vez em GET /auth/csrf.
 */
async function ensureCsrfCookie(): Promise<void> {
  if (getCsrfToken()) return;
  if (csrfPrimed) return;
  csrfPrimed = true;
  try {
    await api.get("/auth/csrf");
  } catch {
    // Sem sessão ainda (ex.: login/register) o backend responde fora do fluxo
    // protegido e o próprio endpoint seta o cookie. Seguimos sem travar.
  }
}

api.interceptors.request.use(async (config) => {
  if (isMutating(config.method) && config.url !== "/auth/csrf") {
    await ensureCsrfCookie();
    const csrf = getCsrfToken();
    if (csrf) {
      config.headers["X-CSRF-Token"] = csrf;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      const path = window.location.pathname;
      if (path !== "/" && path !== "/login" && !path.startsWith("/demo")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(err);
  }
);

export default api;
