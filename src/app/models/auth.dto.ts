export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface UserInfoDto {
  Id: string;
  FirstName: string;
  Email: string;
  role: UserRole;
}

export enum UserRole {
  Administrator = 1,
  Customer = 2,
// Customer='Customer',
// Administrator='Administrator'
}