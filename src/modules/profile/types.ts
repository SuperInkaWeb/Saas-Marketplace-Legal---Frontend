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
