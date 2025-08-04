import { UserRole } from "./auth.dto";

export interface UserDto {
  id: number;
  role:UserRole;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: AddressDto;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}



export interface AddressDto {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}