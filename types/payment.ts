export interface PaymentIntent {
  id: string;
  amount: number;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'failed';
  client_secret: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer';
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface PaymentMetadata {
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
} 