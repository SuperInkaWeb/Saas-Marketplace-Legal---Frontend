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

// DEBUG: Request logger
if (process.env.NODE_ENV === "development") {
  api.interceptors.request.use((config) => {
    (config as any).metadata = { startTime: new Date() };
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      const startTime = (response.config as any).metadata.startTime;
      const duration = new Date().getTime() - startTime.getTime();
      console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
      return response;
    },
    (error) => {
      const startTime = error.config?.metadata?.startTime;
      if (startTime) {
        const duration = new Date().getTime() - startTime.getTime();
        console.error(`[API] ${error.config.method?.toUpperCase()} ${error.config.url} - FAILED (${duration}ms)`);
      }
      return Promise.reject(error);
    }
  );
}

let lastToastTime = 0;
const TOAST_COOLDOWN = 3000;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const isAuthEndpoint = error.config?.url?.includes("/auth/");
    const now = Date.now();
    const canShowToast = now - lastToastTime > TOAST_COOLDOWN;

    // 1. Session Expiration (401 Unauthorized)
    if (error.response?.status === 401 && !isAuthEndpoint) {
      const { logout } = useAuthStore.getState();
      
      if (typeof window !== "undefined") {
        if (!window.location.pathname.includes("/login")) {
          if (canShowToast) {
            toast.error("Sesión expirada", {
              description: "Tu sesión ha terminado. Serás redirigido al login en breve.",
            });
            lastToastTime = now;
          }
          // Debounce redirect to allow toast visibility
          await new Promise(resolve => setTimeout(resolve, 2000));
          logout();
          window.location.href = "/login";
        } else {
          logout();
        }
      } else {
        logout();
      }
    }

    // 2. Permissions (403 Forbidden)
    else if (error.response?.status === 403 && !isAuthEndpoint) {
      const isMeEndpoint = error.config?.url?.includes("/me");
      if (isMeEndpoint) {
        const { logout } = useAuthStore.getState();
        logout();
        if (typeof window !== "undefined") window.location.href = "/login";
      } else if (canShowToast) {
        toast.error("Acceso denegado", {
          description: "No tienes permisos suficientes para realizar esta acción.",
        });
        lastToastTime = now;
      }
    }

    // 3. Rate Limiting (429 Too Many Requests)
    else if (error.response?.status === 429) {
      if (canShowToast) {
        toast.warning("Demasiadas solicitudes", {
          description: "Por favor, espera unos segundos antes de intentar de nuevo.",
        });
        lastToastTime = now;
      }
    }

    // 4. Server Errors or Network Issues (500+)
    else if (!error.response || error.response.status >= 500) {
      if (canShowToast) {
        toast.error("Error del sistema", {
          description: "Ocurrió un problema de conexión. Por favor intenta más tarde.",
        });
        lastToastTime = now;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;