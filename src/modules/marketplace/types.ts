export interface CaseRequestResponse {
  publicId: string;
  clientName: string;
  title: string;
  description: string;
  budget: number;
  specialtyName?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
}

export interface CreateProposalRequest {
  proposalText: string;
  proposedFee: number;
}

export interface LawyerProposalResponse {
  id: number;
  lawyerName: string;
  lawyerPublicId: string;
  proposalText: string;
  proposedFee: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface DashboardStatsResponse {
  pendingAppointments: number;
  totalProposals: number;
  ratingAvg: number;
  reviewCount: number;
}

export interface ReviewResponse {
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface LawyerSearchResponse {
  publicId: string;
  slug: string;
  fullName: string;
  avatarUrl?: string;
  city: string;
  country: string;
  hourlyRate: number;
  currency: string;
  ratingAvg: number;
  reviewCount: number;
  isVerified: boolean;
  specialties: string[];
}

export interface LawyerSearchParams {
  city?: string;
  specialtyId?: number;
  minRating?: number;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
