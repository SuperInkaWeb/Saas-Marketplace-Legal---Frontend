export interface UpdateClientProfileRequest {
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  phoneNumber: string;
  companyName?: string;
  billingAddress?: string;
}

export interface UpdateLawyerProfileRequest {
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  phoneNumber: string;
  bio?: string;
  city: string;
  country: string;
  hourlyRate: number;
  currency: string;
  barRegistrationNumber?: string;
  barAssociation?: string;
}

export interface LawyerProfileConfigResponse {
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  phoneNumber: string;
  email: string;
  avatarUrl?: string;
  slug?: string;
  bio?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  hourlyRate?: number;
  currency?: string;
  barRegistrationNumber?: string;
  barAssociation?: string;
  verificationStatus: string;
  isVerified: boolean;
  ratingAvg?: number;
  reviewCount?: number;

  specialties: {
    id: number;
    name: string;
    description?: string;
  }[];
  schedules: {
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[];
}

export interface SpecialtyResponse {
  id: number;
  name: string;
  description?: string;
}

export interface UpdateSpecialtiesRequest {
  specialtyIds: number[];
}

// Horarios
export interface ScheduleRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface ScheduleResponse {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

