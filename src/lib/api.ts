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

let lastToastTime = 0;
const TOAST_COOLDOWN = 2000; // 2 seconds

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes("/auth/");
    const now = Date.now();
    const canShowToast = now - lastToastTime > TOAST_COOLDOWN;

    // Handle Session Expiration (401 Unauthorized)
    if (error.response?.status === 401 && !isAuthEndpoint) {
      const { logout } = useAuthStore.getState();
      
      if (typeof window !== "undefined") {
        if (!window.location.pathname.includes("/login")) {
          if (canShowToast) {
            toast.error("Sesión expirada", {
              description: "Por favor, inicia sesión de nuevo para continuar.",
            });
            lastToastTime = now;
          }
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
      const isMeEndpoint = error.config?.url?.includes("/me");
      
      if (isMeEndpoint) {
        // If /me is forbidden, the entire session/account state is likely invalid for the app
        const { logout } = useAuthStore.getState();
        if (typeof window !== "undefined") {
          logout();
          window.location.href = "/login";
        } else {
          logout();
        }
      } else if (typeof window !== "undefined" && canShowToast) {
        toast.error("Acceso denegado", {
          description: "No tienes permisos suficientes para realizar esta acción.",
        });
        lastToastTime = now;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;