import { AdminUsersSortByEnum, SortDirectionEnum, UserRoleEnum } from './enums';

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRoleEnum[];
  isBlocked: boolean;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date | null;
  orderCount: number | null;
}

export interface AdminUserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  emailConfirmed: boolean | null;
  isBlocked: boolean;
  createdAt: Date;
  roles: UserRoleEnum[];
}

export interface UserProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  joinDate: Date;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
}

export interface UpdateUserProfileRequestDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface AdminUpdateUserProfileRequestDto {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  isBlocked: boolean | null;
  roles: string[] | null;
}

export interface UpdateUserProfileResponseDto {
  message: string;
}

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AdminChangePasswordResponseDto {
  newPassword: string;
}

export interface ChangePasswordResponseDto {
  message: string;
}

export interface UserStatsDto {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalSpent: number;
}

export interface AdminUsersStatsDto {
  totalUsersCount: number;
  totalActiveUsersCount: number;
  totalBlockedUsersCount: number;
  totalNewUsersCountThisMonth: number;
}

export interface GetAllUsersRequestDto {
  pageNumber: number;
  pageSize: number;
  searchTerm: string | null;
  sortDirection: SortDirectionEnum | null;
  sortBy: AdminUsersSortByEnum | null;
  isBlocked: boolean | null;
  userRole: UserRoleEnum | null;
}

export interface GetAllUsersResponseDto {
  users: AdminUserDto[];
  totalQueryCount: number;
  adminUsersStats: AdminUsersStatsDto;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
