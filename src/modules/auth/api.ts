import api from "@/lib/api";
import type { AuthResponse, LoginRequest, ClientRegistrationRequest } from "./types";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  registerClient: async (data: ClientRegistrationRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/register/client", data);
    return res.data;
  },
};