export type MatterStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING_CLIENT' | 'IN_LITIGATION' | 'SETTLED' | 'CLOSED';
export type MatterEventType = 'HEARING' | 'FILING' | 'NOTIFICATION' | 'NOTE' | 'MEETING' | 'EVIDENCE' | 'SENTENCE' | 'OTHER';
export type MatterTaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type ParticipantRole = 'OPPOSING_COUNSEL' | 'OPPOSING_PARTY' | 'JUDGE' | 'COURT' | 'WITNESS' | 'EXPERT' | 'OTHER';

export interface MatterEventResponse {
  publicId: string;
  title: string;
  description?: string;
  eventType: MatterEventType;
  eventDate: string;
  createdAt: string;
  documentPublicId?: string;
  documentName?: string;
}

export interface MatterTaskResponse {
  publicId: string;
  title: string;
  description?: string;
  dueDate?: string;
  completedAt?: string;
  status: MatterTaskStatus;
  createdAt: string;
}

export interface MatterParticipantResponse {
  publicId: string;
  fullName: string;
  role: ParticipantRole;
  email?: string;
  phone?: string;
  firmOrInstitution?: string;
  professionalId?: string;
  notes?: string;
  createdAt: string;
}

export interface MatterParticipantRequest {
  fullName: string;
  role: ParticipantRole;
  email?: string;
  phone?: string;
  firmOrInstitution?: string;
  professionalId?: string;
  notes?: string;
}

export interface MatterResponse {
  publicId: string;
  title: string;
  description: string;
  number: string;
  status: MatterStatus;
  jurisdiction: string;
  startDate: string;
  estimatedEndDate?: string;
  clientName: string;
  clientId: number;
}

export interface MatterCreateRequest {
  title: string;
  description?: string;
  jurisdiction: string;
  clientPublicId?: string;
  unregisteredClientName?: string;
}

export interface MatterEventRequest {
  title: string;
  description?: string;
  eventType: MatterEventType;
  eventDate?: string;
  documentPublicId?: string;
}

export interface MatterTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
}

// Utility: Human-readable labels for participant roles
export const PARTICIPANT_ROLE_LABELS: Record<ParticipantRole, string> = {
  OPPOSING_COUNSEL: 'Abogado Contrario',
  OPPOSING_PARTY: 'Contraparte',
  JUDGE: 'Juez',
  COURT: 'Juzgado / Tribunal',
  WITNESS: 'Testigo',
  EXPERT: 'Perito',
  OTHER: 'Otro',
};
