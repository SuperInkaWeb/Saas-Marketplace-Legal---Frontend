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