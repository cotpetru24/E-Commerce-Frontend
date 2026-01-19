export interface AddressData {
  addressLine1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  instructions: string;
  saveAddress: boolean;
}

export interface ShippingInfo {
  method: string;
  estimatedDelivery: string;
}
