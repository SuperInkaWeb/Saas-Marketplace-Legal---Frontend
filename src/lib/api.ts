import axios from "axios";
import { useAuthStore } from "../modules/auth/store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes("/auth/");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;