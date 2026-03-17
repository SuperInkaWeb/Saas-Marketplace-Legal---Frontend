import api from "@/lib/api";
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  OtpVerificationRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserMeResponse,
  SelectRoleRequest,
  CreateClientProfileRequest,
  CreateLawyerProfileRequest,
  UploadIdentityDocumentRequest,
  KycStatusResponse
} from "./types";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<string> => {
    const res = await api.post<string>("/auth/register", data);
    return res.data;
  },

  verifyOtp: async (data: OtpVerificationRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/verify-otp", data);
    return res.data;
  },

  resendOtp: async (data: ResendOtpRequest): Promise<string> => {
    const res = await api.post<string>("/auth/resend-otp", data);
    return res.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<string> => {
    const res = await api.post<string>("/auth/forgot-password", data);
    return res.data;
  },

  validateResetOtp: async (data: OtpVerificationRequest): Promise<string> => {
    const res = await api.post<string>("/auth/validate-reset-otp", data);
    return res.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<string> => {
    const res = await api.post<string>("/auth/reset-password", data);
    return res.data;
  },

  // ── USER / ME ──────────────────────────────────────────────────────

  getMe: async (): Promise<UserMeResponse> => {
    const res = await api.get<UserMeResponse>("/me");
    return res.data;
  },

  // ── ONBOARDING ─────────────────────────────────────────────────────

  selectRole: async (data: SelectRoleRequest): Promise<UserMeResponse> => {
    const res = await api.post<UserMeResponse>("/onboarding/select-role", data);
    return res.data;
  },

  createClientProfile: async (data: CreateClientProfileRequest): Promise<UserMeResponse> => {
    const res = await api.post<UserMeResponse>("/onboarding/profile/client", data);
    return res.data;
  },

  createLawyerProfile: async (data: CreateLawyerProfileRequest): Promise<UserMeResponse> => {
    const res = await api.post<UserMeResponse>("/onboarding/profile/lawyer", data);
    return res.data;
  },

  getOnboardingStatus: async (): Promise<UserMeResponse> => {
    const res = await api.get<UserMeResponse>("/onboarding/status");
    return res.data;
  },

  // ── KYC ────────────────────────────────────────────────────────────

  uploadKycDocument: async (data: UploadIdentityDocumentRequest): Promise<UserMeResponse> => {
    const res = await api.post<UserMeResponse>("/kyc/upload-document", data);
    return res.data;
  },

  getKycStatus: async (): Promise<KycStatusResponse> => {
    const res = await api.get<KycStatusResponse>("/kyc/status");
    return res.data;
  },
};