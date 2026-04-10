export type MatterStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING_CLIENT' | 'IN_LITIGATION' | 'SETTLED' | 'CLOSED';

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
