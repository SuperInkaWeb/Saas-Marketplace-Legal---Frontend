import { UUID } from "crypto";

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
  city?: string;
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
