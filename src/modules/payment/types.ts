export interface PaymentResponse {
  publicId: string;
  clientName: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  createdAt: string;
}
