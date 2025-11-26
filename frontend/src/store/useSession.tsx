import { create } from "zustand";

type SessionState = {
  token: string | null;
  isLogged: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
};

function readTokenFromStorage(): string | null {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
}

export const useSession = create<SessionState>((set) => {
  const initialToken = readTokenFromStorage();

  return {
    token: initialToken,
    isLogged: !!initialToken,

    setToken: (token) => {
      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }
      set({ token, isLogged: !!token });
    },

    logout: () => {
      localStorage.removeItem("accessToken");
      set({ token: null, isLogged: false });
      window.location.assign("/login");
    },
  };
});
