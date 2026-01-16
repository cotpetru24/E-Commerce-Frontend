export interface PaymentDto {
  orderId: number;
  amount: number;
  currency?: string;
  cardBrand?: string;
  cardLast4?: string;
  billingName?: string;
  billingEmail?: string;
  status: string;
  receiptUrl?: string;
  paymentMethod?: string;
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
