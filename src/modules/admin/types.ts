// ── Admin Dashboard ──────────────────────────────────────────────────
export interface AdminDashboardResponse {
  totalUsers: number;
  totalLawyers: number;
  totalClients: number;
  pendingVerifications: number;
  totalAppointments: number;
  totalReviews: number;
  recentRegistrations: number;
  monthlyRevenue: number;
}

// ── Admin User List ──────────────────────────────────────────────────
export interface AdminUserListResponse {
  publicId: string;
  fullName: string;
  email: string;
  role: string;
  accountStatus: string;
  isVerified: boolean;
  createdAt: string;
}

// ── Admin User Detail ────────────────────────────────────────────────
export interface AdminUserDetailResponse {
  publicId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  accountStatus: string;
  onboardingStep: string;
  createdAt: string;
  city: string | null;
  country: string | null;
  barRegistrationNumber: string | null;
  barAssociation: string | null;
  verificationStatus: string | null;
  isVerified: boolean;
  hourlyRate: number | null;
  currency: string | null;
  ratingAvg: number | null;
  reviewCount: number;
  kycDocumentType: string | null;
  kycDocumentNumber: string | null;
  kycCountryCode: string | null;
  kycIsVerified: boolean;
}

// ── Pending Lawyers ──────────────────────────────────────────────────
export interface AdminLawyerPendingResponse {
  userPublicId: string;
  lawyerPublicId: string;
  fullName: string;
  email: string;
  city: string;
  country: string;
  barRegistrationNumber: string | null;
  barAssociation: string | null;
  kycDocumentType: string | null;
  kycDocumentNumber: string | null;
  createdAt: string;
}

// ── Requests ─────────────────────────────────────────────────────────
export interface UpdateAccountStatusRequest {
  accountStatus: "ACTIVE" | "BLOCKED";
}

export interface VerifyLawyerRequest {
  verificationStatus: "VERIFIED" | "REJECTED";
  rejectionReason?: string;
}

// ── Specialties ──────────────────────────────────────────────────────
export interface SpecialtyResponse {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  lawyerCount?: number; // Useful for the admin to see how many lawyers use it
}

export interface CreateSpecialtyRequest {
  name: string;
  description: string;
  isActive?: boolean;
}

// ── Paginated response ───────────────────────────────────────────────
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ── Document Templates ───────────────────────────────────────────────
export interface DocumentTemplateResponse {
  publicId: string;
  name: string;
  code: string;
  jurisdiction: string;
  content: string;
  requiredFields: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentTemplateRequest {
  name: string;
  code: string;
  jurisdiction: string;
  content: string;
  requiredFields: string;
  isActive: boolean;
}
