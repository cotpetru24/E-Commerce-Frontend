import { UserRoleEnum } from "./enums";

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | null;
}

export interface UserInfoDto {
  Id: string;
  FirstName: string;
  Email: string;
  role: UserRoleEnum;
}
