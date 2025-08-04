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
  Role: string;
}

export enum UserRole {
CUSTOMER='Customer',
ADMINISTRATOR='Administrator'
}