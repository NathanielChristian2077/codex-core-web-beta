import axios from 'axios'
import { env } from './env'


const api = axios.create({ baseURL: env.apiUrl });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
});

api.interceptors.response.use(r => r, err => {
    const code = err?.response?.status;
    if (code === 401 || code === 403) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }
    return Promise.reject(err);
})

export default api;