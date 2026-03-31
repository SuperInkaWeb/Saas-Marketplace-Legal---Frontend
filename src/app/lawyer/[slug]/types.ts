export interface Specialty {
  name: string;
  description: string;
}

export interface Schedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface PublicProfile {
  publicId: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  city: string;
  country: string;
  hourlyRate: number;
  currency: string;
  barAssociation: string;
  barRegistrationNumber: string;

  specialties: Specialty[];
  schedules: Schedule[];
  isVerified?: boolean;
  ratingAvg?: number;
  reviewCount?: number;
  ratingBreakdown?: Record<number, number>;
}
