import { create } from "zustand";
import { fetchSession, logoutUser } from "../features/auth/api";

type User = {
  id: string;
  email: string;
  role: string;
};

type SessionState = {
  user: User | null;
  loading: boolean;
  isLogged: boolean;

  loadSession: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

export const useSession = create<SessionState>((set) => ({
  user: null,
  loading: true,
  isLogged: false,

  loadSession: async () => {
    try {
      const user = await fetchSession();
      set({ user, isLogged: true, loading: false });
    } catch {
      set({ user: null, isLogged: false, loading: false });
    }
  },

  logout: async () => {
    try {
      await logoutUser();
    } finally {
      set({ user: null, isLogged: false });
      window.location.assign("/login");
    }
  },

  setUser: (user) => {
    set({ user, isLogged: !!user });
  },
}));
