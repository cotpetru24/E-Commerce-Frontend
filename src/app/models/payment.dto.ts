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
