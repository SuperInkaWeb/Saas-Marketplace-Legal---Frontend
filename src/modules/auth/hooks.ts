import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "./api";
import { useAuthStore } from "./store";
import type {
  LoginRequest,
  RegisterRequest,
  OtpVerificationRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SelectRoleRequest,
  CreateClientProfileRequest,
  CreateLawyerProfileRequest,
  UploadIdentityDocumentRequest
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
      handleOnboardingRedirect(response.onboardingStep, router);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
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
      handleOnboardingRedirect(response.onboardingStep, router);
    },
  });
}

// ── USER / ME ──────────────────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: () => authApi.getMe(),
    retry: false,
  });
}

// ── ONBOARDING ─────────────────────────────────────────────────────

export function useSelectRole() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (data: SelectRoleRequest) => authApi.selectRole(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      router.push("/onboarding/perfil");
    },
  });
}

export function useCreateClientProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (data: CreateClientProfileRequest) => authApi.createClientProfile(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      router.push("/dashboard");
    },
  });
}

export function useCreateLawyerProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (data: CreateLawyerProfileRequest) => authApi.createLawyerProfile(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      router.push("/onboarding/verificacion");
    },
  });
}

// ── KYC ────────────────────────────────────────────────────────────

export function useUploadKyc() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (data: UploadIdentityDocumentRequest) => authApi.uploadKycDocument(data),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      router.push("/dashboard");
    },
  });
}

export function useKycStatus() {
  return useQuery({
    queryKey: ["kyc-status"],
    queryFn: () => authApi.getKycStatus(),
  });
}

// ── HELPERS ────────────────────────────────────────────────────────

export function handleOnboardingRedirect(step: string | undefined | null, router: any) {
  if (!step) {
    router.push("/onboarding/rol");
    return;
  }

  const normalizedStep = step.toUpperCase();

  switch (normalizedStep) {
    case "ROLE_SELECTION":
    case "ACCOUNT_CREATED":
      router.push("/onboarding/rol");
      break;
    case "PROFILE_PENDING":
      router.push("/onboarding/perfil");
      break;
    case "KYC_PENDING":
      router.push("/onboarding/verificacion");
      break;
    case "COMPLETED":
      router.push("/dashboard");
      break;
    default:
      console.warn("Unknown onboarding step:", step);
      router.push("/onboarding/rol");
  }
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
    const isUnverified = data?.detail?.includes("verificada") || false;

    return {
      message: data?.detail || "Ocurrió un error inesperado",
      help: data?.ayuda || null,
      isGone,
      isUnverified
    };
  }

  return { message: "Error de conexión con el servidor", isGone: false, isUnverified: false };
}