import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "./api";
import { useAuthStore } from "./store";
import type { 
  LoginRequest, 
  ClientRegistrationRequest,
  LawyerRegistrationRequest,
  OtpVerificationRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from "./types";
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

  return useMutation({
    mutationFn: (data: ClientRegistrationRequest) => authApi.registerClient(data),
    onSuccess: (_, variables) => {
      router.push(`/verificar-cuenta?email=${encodeURIComponent(variables.email)}`);
    },
  });
}

export function useRegisterLawyer() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LawyerRegistrationRequest) => authApi.registerLawyer(data),
    onSuccess: (_, variables) => {
      router.push(`/verificar-cuenta?email=${encodeURIComponent(variables.email)}`);
    },
  });
}

export function useVerifyOtp() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: OtpVerificationRequest) => authApi.verifyOtp(data),
    onSuccess: (response) => {
      setAuth(response);
      router.push("/dashboard");
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (data: ResendOtpRequest) => authApi.resendOtp(data),
  });
}

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
    onSuccess: (_, variables) => {
      router.push(`/restablecer-contrasena?email=${encodeURIComponent(variables.email)}`);
    },
  });
}

export function useValidateResetOtp() {
  return useMutation({
    mutationFn: (data: OtpVerificationRequest) => authApi.validateResetOtp(data),
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data),
    onSuccess: () => {
      router.push("/login?reset=success");
    },
  });
}

export function extractApiError(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    const isGone = error.response?.status === 410;
    
    return {
      message: data?.detail || "Ocurrió un error inesperado",
      help: data?.ayuda || null,
      isGone
    };
  }
  
  return { message: "Error de conexión con el servidor", isGone: false };
}