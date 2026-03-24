
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
  createdAt: string;
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
  createdAt: string;
}

export interface CaseRequestResponse {
  publicId: string;
  title: string;
  description: string;
  budget?: number;
  specialtyName?: string;
  clientName: string;
  createdAt: string;
}

export interface CreateProposalRequest {
  proposalText: string;
  proposedFee: number;
}

export interface LawyerProposalResponse {
  id: string;
  publicId: string;
  casePublicId: string;
  lawyerPublicId: string;
  proposalText: string;
  proposedFee: number;
  status: string;
  createdAt: string;
}

export interface DashboardStatsResponse {
  pendingAppointments: number;
  totalProposals: number;
  ratingAvg: number;
  reviewCount: number;
}
