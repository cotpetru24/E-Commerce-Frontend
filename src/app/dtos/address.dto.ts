export interface AddressDto {
  id: number;
  userId?: string;
  addressLine1: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export interface CreateAddressRequestDto {
  addressLine1: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export interface CreateAddressResponseDto {
  id: number;
  message: string;
  createdAt: Date;
}

export interface DeleteAddressResponseDto {
  message: string;
}
