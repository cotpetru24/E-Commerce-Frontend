export interface AddressDto {
  id: number;
  addressLine1: string;
  city: string;
  postcode: string;
  country: string;
}

export interface CreateAddressRequestDto {
  addressLine1: string;
  city: string;
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
