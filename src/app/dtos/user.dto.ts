import { UserRole } from '.';

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  isBlocked: boolean;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  orderCount?: number;
}

export interface AdminUserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  isBlocked: boolean;
  emailConfirmed?: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  orderCount?: number;
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
  email?: string;
  firstName?: string;
  lastName?: string;
  isBlocked?: boolean;
  roles?: string[];
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
  searchTerm?: string | null;
  sortDirection: UsersSortDirection | null;
  sortBy?: UsersSortBy | null;
  userStatus?: UserStatus | null;
  userRole?: UserRole | null;
}

export interface GetAllUsersResponseDto {
  users: AdminUserDto[];
  totalQueryCount: number;
  adminUsersStats: AdminUsersStatsDto;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export enum UsersSortBy {
  DateCreated = 1,
  Name = 2,
}

export enum UsersSortDirection {
  Ascending = 1,
  Descending = 2,
}

export enum UserStatus {
  Active = 1,
  Blocked = 2,
}
