
export interface LawyerSearchResponse {
  publicId: string;
  slug: string;
  fullName: string;
  avatarUrl: string;
  city: string;
  country: string;
  hourlyRate: number;
  currency: string;
  ratingAvg: number;
  reviewCount: number;
  isVerified: boolean;
  specialties: string[];
  bio?: string;
}

export interface SpecialtyResponse {
  id: number;
  name: string;
  description: string;
}

export interface SearchParams {
  query?: string;
  specialtyId?: number;
  minRating?: number;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface ReviewDTO {
  publicId: string;
  lawyerPublicId: string;
  appointmentPublicId: string;
  clientName: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  replyText?: string;
  repliedAt?: string;
  createdAt: string;
  isFeatured: boolean;
}

export interface ReviewReplyRequest {
  replyText: string;
}

export interface ReviewCreateRequest {
  appointmentPublicId: string;
  rating: number;
  comment: string;
  isAnonymous?: boolean;
}

export interface ReviewResponse {
  publicId: string;
  clientName: string;
  rating: number;
  comment: string;
  replyText?: string;
  repliedAt?: string;
  createdAt: string;
  isFeatured: boolean;
}

export interface CaseRequestResponse {
  publicId: string;
  title: string;
  description: string;
  budget?: number;
  currency?: string;
  specialtyName?: string;
  clientName: string;
  clientAvatarUrl?: string;
  createdAt: string;
}

export interface CreateProposalRequest {
  proposalText: string;
  proposedFee: number;
  currency?: string;
}

export interface LawyerProposalResponse {
  id: string;
  publicId: string;
  casePublicId: string;
  lawyerPublicId: string;
  lawyerSlug: string;
  proposalText: string;
  proposedFee: number;
  currency?: string;
  status: string;
  lawyerAvatarUrl?: string;
  createdAt: string;
}

export interface DashboardStatsResponse {
  pendingAppointments: number;
  totalProposals: number;
  ratingAvg: number;
  reviewCount: number;
  ratingBreakdown?: Record<number, number>;
}

// ── Client Case Flow Types ───────────────────────────────────────────

export enum CaseRequestStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  CLOSED = "CLOSED",
}

export enum ProposalStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface CreateCaseRequest {
  title: string;
  description: string;
  specialtyId?: number;
  budget?: number;
  currency?: string;
}

export interface ClientProposalResponse {
  id: number;
  lawyerName: string;
  lawyerPublicId: string;
  lawyerSlug: string;
  proposalText: string;
  proposedFee: number;
  currency?: string;
  status: ProposalStatus;
  lawyerAvatarUrl?: string;
  createdAt: string;
}

export interface CaseWithProposalsResponse {
  publicId: string;
  title: string;
  description: string;
  budget?: number;
  currency?: string;
  specialtyName?: string;
  clientName: string;
  clientAvatarUrl?: string;
  status: CaseRequestStatus;
  createdAt: string;
  proposals: ClientProposalResponse[];
}

// ── Moderation & Reporting Types ─────────────────────────────────────

export enum ReportReason {
  OFFENSIVE_LANGUAGE = "OFFENSIVE_LANGUAGE",
  SPAM = "SPAM",
  FALSE_INFORMATION = "FALSE_INFORMATION",
  UNFAIR_CRITICISM = "UNFAIR_CRITICISM",
  OTHER = "OTHER",
}

export enum ReportStatus {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  DISMISSED = "DISMISSED",
}

export interface ReviewReportRequest {
  reason: ReportReason;
  details?: string;
}

export interface ReviewReportDTO {
  publicId: string;
  reviewId: string;
  reviewComment: string;
  clientName: string;
  reporterId: string;
  reporterName: string;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  createdAt: string;
}
