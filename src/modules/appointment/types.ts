export interface AppointmentRequest {
  lawyerPublicId: string;
  scheduledStart: string;
  scheduledEnd: string;
  notes?: string;
}

export interface AppointmentResponse {
  publicId: string;
  clientPublicId: string;
  clientName: string;
  lawyerPublicId: string;
  lawyerName: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  meetingLink?: string;
  notes?: string;
}
