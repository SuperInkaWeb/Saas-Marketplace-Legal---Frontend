import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "./api";
import { useAuthStore } from "./store";
import type { LoginRequest, ClientRegistrationRequest } from "./types";
import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/utils/types";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response);
      router.push("/dashboard");
    },
  });
}

export function useRegisterClient() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: ClientRegistrationRequest) => authApi.registerClient(data),
    onSuccess: (response) => {
      setAuth(response);
      router.push("/dashboard");
    },
  });
}

export function extractApiError(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    
    return {
      message: data?.detail || "Ocurrió un error inesperado",
      help: data?.ayuda || null
    };
  }
  
  return { message: "Error de conexión con el servidor" };
}