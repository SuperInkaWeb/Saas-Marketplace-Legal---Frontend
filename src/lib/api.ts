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

    // Handle session expiration (401 Unauthorized or 403 Forbidden)
    if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthEndpoint) {
      const { logout } = useAuthStore.getState();
      
      if (typeof window !== "undefined") {
        // Only trigger toast and redirect if we are not already on the login page
        if (!window.location.pathname.includes("/login")) {
          toast.error("Tu sesión ha expirado", {
            description: "Serás redirigido al inicio de sesión en unos segundos...",
            duration: 4000,
          });

          // Wait 3 seconds before logging out and redirecting
          setTimeout(() => {
            logout();
            window.location.href = "/login";
          }, 3000);
        } else {
          // If already on login but somehow got a 401/403, just logout
          logout();
        }
      } else {
        // Server side or non-browser environment
        logout();
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;