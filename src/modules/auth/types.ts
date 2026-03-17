export interface AuthResponse {
  publicId: string;
  email: string;
  fullName: string;
  role: string | null;
  onboardingStep: string;
  accessToken: string;
}

export interface UserMeResponse {
  publicId: string;
  email: string;
  fullName: string;
  role: string | null;
  onboardingStep: string;
  accountStatus: string;
  hasProfile: boolean;
  isVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface SelectRoleRequest {
  role: "CLIENT" | "LAWYER";
}

export interface CreateClientProfileRequest {
  companyName?: string;
  billingAddress?: string;
}

export interface CreateLawyerProfileRequest {
  city: string;
  country: string;
}

export interface UploadIdentityDocumentRequest {
  documentType: string;
  documentNumber: string;
  documentCountryCode: string;
}

export interface KycStatusResponse {
  hasDocument: boolean;
  verificationStatus: string | null;
  documentType: string | null;
}

export interface OtpVerificationRequest {
  email: string;
  code: string;
}

export interface ResendOtpRequest {
  email: string;
  purpose: "ACCOUNT_VERIFICATION" | "PASSWORD_RESET";
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}