export interface SpecialtyInfo {
  id: number;
  name: string;
}

export interface ScheduleInfo {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface AuthResponse {
  publicId: string;
  email: string;
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  phoneNumber: string;
  slug?: string;
  fullName: string;
  role: string | null;
  onboardingStep: string;
  accessToken: string;
  avatarUrl?: string;
  isVerified?: boolean;
  
  // Profile fields
  companyName?: string;
  billingAddress?: string;
  companyLogoUrl?: string;
  bio?: string;
  city?: string;
  country?: string;
  hourlyRate?: number;
  currency?: string;
  barRegistrationNumber?: string;
  barAssociation?: string;
  // Specialties & Schedules
  specialties?: SpecialtyInfo[];
  schedules?: ScheduleInfo[];
}

export interface UserMeResponse {
  publicId: string;
  email: string;
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  phoneNumber: string;
  slug?: string;
  fullName: string;
  role: string | null;
  onboardingStep: string;
  accountStatus: string;
  hasProfile: boolean;
  isVerified: boolean;
  avatarUrl?: string;

  // Profile fields
  companyName?: string;
  billingAddress?: string;
  companyLogoUrl?: string;
  bio?: string;
  city?: string;
  country?: string;
  hourlyRate?: number;
  currency?: string;
  barRegistrationNumber?: string;
  barAssociation?: string;


  // Specialties & Schedules
  specialties?: SpecialtyInfo[];
  schedules?: ScheduleInfo[];
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
  documentNumber: string | null;
  submittedAt: string | null;
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