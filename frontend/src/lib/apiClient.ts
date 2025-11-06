import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';
import { env } from './env'


const api = axios.create({ baseURL: env.apiUrl });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
});

api.interceptors.response.use((res) => res, err => {
  const code = err?.response?.status;
  if (code === 401 || code === 403) {
    useAuthStore.getState().logout();
    window.location.href = "/login";
  }
  return Promise.reject(err);
})

export default api;
