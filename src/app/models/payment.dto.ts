export interface PaymentData {
  method: 'card' | 'paypal';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  saveCard: boolean;
  paypalEmail: string;
  sameAsShipping: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  acceptTerms: boolean;
}
