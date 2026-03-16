import api from "@/lib/api";
import type { 
  AuthResponse, 
  LoginRequest, 
  ClientRegistrationRequest,
  LawyerRegistrationRequest,
  OtpVerificationRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from "./types";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  registerClient: async (data: ClientRegistrationRequest): Promise<string> => {
    const res = await api.post<string>("/auth/register/client", data);
    return res.data;
  },

  registerLawyer: async (data: LawyerRegistrationRequest): Promise<string> => {
    const res = await api.post<string>("/auth/register/lawyer", data);
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
};