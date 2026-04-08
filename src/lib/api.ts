import axios from "axios";
import { useAuthStore } from "../modules/auth/store";
import { toast } from "sonner";

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

    // Handle Session Expiration (401 Unauthorized)
    if (error.response?.status === 401 && !isAuthEndpoint) {
      const { logout } = useAuthStore.getState();
      
      if (typeof window !== "undefined") {
        if (!window.location.pathname.includes("/login")) {
          toast.error("Sesión expirada", {
            description: "Por favor, inicia sesión de nuevo para continuar.",
          });
          logout();
          window.location.href = "/login";
        } else {
          logout();
        }
      } else {
        logout();
      }
    }

    // Handle Permissions (403 Forbidden)
    if (error.response?.status === 403 && !isAuthEndpoint) {
      if (typeof window !== "undefined") {
        toast.error("Acceso denegado", {
          description: "No tienes permisos suficientes para realizar esta acción.",
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;