export interface OrderItem {
  product: {
    id: number;
    name: string;
    brandName: string;
    imagePath: string;
    price: number;
  };
  quantity: number;
  size?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentMethod {
  method: 'card' | 'paypal';
  cardNumber?: string;
  cardholderName?: string;
  paypalEmail?: string;
}

export interface ShippingInfo {
  method: string;
  estimatedDelivery: string;
}
