import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse } from "./types";

interface AuthState {
  token: string | null;
  user: Omit<AuthResponse, "accessToken"> | null;
  setAuth: (response: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: ({ accessToken, ...user }) =>
        set({ token: accessToken, user }),

      logout: () => set({ token: null, user: null }),

      isAuthenticated: () => !!get().token,
    }),
    { name: "auth-storage" }
  )
);