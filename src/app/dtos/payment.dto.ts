import { PaymentStatusEnum } from "./enums";

export interface PaymentDto {
  orderId: number;
  amount: number;
  currency: string;
  cardBrand: string | null;
  cardLast4: string | null;
  status: PaymentStatusEnum;
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
