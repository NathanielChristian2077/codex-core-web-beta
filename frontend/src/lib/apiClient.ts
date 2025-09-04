import axios from 'axios'
import { env } from './env'
import { useSession } from '../store/useSession'


export const api = axios.create({ baseURL: env.apiUrl })
api.interceptors.request.use((config) => {
    const token = useSession.getState().token
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})