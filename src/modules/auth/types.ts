export interface AuthResponse {
  publicId: string;
  email: string;
  fullName: string;
  roles: string[];
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ClientRegistrationRequest {
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  email: string;
  password: string;
  phoneNumber?: string;
  companyName?: string;
  billingAddress?: string;
}

export interface LawyerRegistrationRequest {
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  email: string;
  password: string;
  phoneNumber?: string;
  city: string;
  country: string;
  documentType: string;
  documentNumber: string;
  documentCountryCode: string;
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