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
