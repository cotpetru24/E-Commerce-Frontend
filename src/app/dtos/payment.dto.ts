export interface PaymentDto {
  paymentId: number;
  orderId: number;
  amount: number;
  currency?: string;
  cardBrand?: string;
  cardLast4?: string;
  billingName?: string;
  billingEmail?: string;
  paymentStatus: string;
  receiptUrl?: string;
  paymentMethod?: string;
  transactionId?: string;
  createdAt?: Date;
}

export interface StorePaymentRequestDto {
  orderId: number;
  paymentIntentId: string;
}

export interface CreatePaymentIntentRequestDto {
  amount: number;
}

export interface CreatePaymentIntentResponseDto {
  clientSecret: string;
}
