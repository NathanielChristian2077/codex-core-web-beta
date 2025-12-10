import axios from "axios";

function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

function getToken() {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const csrf = getCsrfToken();
  if (csrf) config.headers["X-CSRF-Token"] = csrf;

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem("accessToken");
      if (!location.pathname.startsWith("/login")) location.assign("/login");
    }
    return Promise.reject(err);
  }
);

export default api;
