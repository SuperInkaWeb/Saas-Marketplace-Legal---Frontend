import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse } from "./types";

const normalizeRole = (role: string | null | undefined): string | null => {
  if (!role) return null;
  const upperRole = role.toUpperCase().trim();
  return upperRole.startsWith("ROLE_") ? upperRole.substring(5) : upperRole;
};

interface AuthState {
  token: string | null;
  user: Omit<AuthResponse, "accessToken"> | null;
  hydrated: boolean;

  setAuth: (response: AuthResponse) => void;
  updateUser: (user: Partial<Omit<AuthResponse, "accessToken">>) => void;
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
        set({
          token: accessToken,
          user: { ...user, role: normalizeRole(user.role) },
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...userData,
                role:
                  userData.role !== undefined
                    ? normalizeRole(userData.role)
                    : state.user.role,
              }
            : null,
        })),

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