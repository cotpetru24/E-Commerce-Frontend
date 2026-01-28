export interface PaymentDto {
  orderId: number;
  amount: number;
  currency: string;
  cardBrand: string | null;
  cardLast4: string | null;
  status: string;
  paymentMethod: string;
  receiptUrl: string;
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

export enum PaymentStatusEnum {
  Pending = 1,
  Authorised = 3,
  Failed = 4,
  Refunded = 6,
  Paid = 12,
}
