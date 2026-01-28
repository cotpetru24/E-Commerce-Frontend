export interface AddressData {
  addressLine1: string;
  city: string;
  postcode: string;
  country: string;
  instructions: string;
}

export interface ShippingInfo {
  method: string;
  estimatedDelivery: string;
}
