import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse } from "./types";

interface AuthState {
  token: string | null;
  user: Omit<AuthResponse, "accessToken"> | null;
  hydrated: boolean;

  setAuth: (response: AuthResponse) => void;
  logout: () => void;
  setHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,

      setAuth: ({ accessToken, ...user }) =>
        set({ token: accessToken, user }),

      logout: () =>
        set({ token: null, user: null }),

      setHydrated: (state) =>
        set({ hydrated: state }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);