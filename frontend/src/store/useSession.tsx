import { create } from "zustand";
import { persist } from "zustand/middleware";

type SessionState = {
  token: string | null;
  isLogged: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
};

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      token: localStorage.getItem("accessToken"),
      isLogged: !!localStorage.getItem("accessToken"),

      setToken: (token) => {
        if (token) localStorage.setItem("accessToken", token);
        else localStorage.removeItem("accessToken");
        set({ token, isLogged: !!token });
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        set({ token: null, isLogged: false });
        window.location.assign("/login");
      },
    }),
    { name: "session" }
  )
);
