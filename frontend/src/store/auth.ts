import { create } from "zustand";
import api from " @/lib/apiClient ";

type AuthState = {
    token: string | null;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
    token: localStorage.getItem("token"),
    async login(email, senha) {
        const res = await api.post("auth/login", { email, senha });
        const token = res.data.accessToken as string;
        localStorage.setItem("token", token);
        set({ token });
    },
    logout() {
        localStorage.removeItem("token");
        set({ token: null });
    },
}));