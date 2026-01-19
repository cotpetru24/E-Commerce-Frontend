export interface ShippingAddressDto {
  id: number;
  userId?: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  phoneNumber?: string;
}

export interface BillingAddressDto {
  id: number;
  userId?: string;
  addressLine1: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export interface AdminBillingAddressDto {
  id: number;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

export interface CreateShippingAddressRequestDto {
  addressLine1: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export interface CreateBillingAddressRequestDto {
  addressLine1: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export interface DeleteShippingAddressResponseDto {
  message: string;
}

export interface CreateShippingAddressResponseDto {
  id: number;
  message: string;
  createdAt: Date;
}

export interface UpdateShippingAddressRequestDto {
  id: number;
  userId?: string;
  addressLine1: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}
