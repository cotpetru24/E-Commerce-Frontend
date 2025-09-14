// ============================================================================
// SHIPPING ADDRESS DTOs
// ============================================================================
// These interfaces match the backend Shipping Address DTOs

export interface ShippingAddressDto {
  id: number;
  userId?: string;
  addressLine1: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export interface CreateShippingAddressRequestDto {
  addressLine1: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export interface UpdateShippingAddressRequestDto {
  addressLine1: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export interface ShippingAddressResponseDto {
  id: number;
  message: string;
  createdAt: Date;
}
