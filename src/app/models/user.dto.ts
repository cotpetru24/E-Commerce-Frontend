import { AdminUser } from "../services/api/admin-api.service";
import { UserRole } from "./auth.dto";

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

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserStatsDto {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalSpent: number;
}


export interface GetAllUsersRequestDto {
pageNumber: number;
pageSize: number;
searchTerm?: string | null;
sortDirection : UsersSortDirection | null
sortBy?: UsersSortBy | null;
userStatus?: UserStatus | null;
userRole?: UserRole | null;
}


export interface GetAllUsersResponseDto {
  users: AdminUser[];
  totalQueryCount: number;
  adminUsersStats: AdminUsersStatsDto;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminUsersStatsDto{
totalUsersCount: number;
totalActiveUsersCount: number;
totalBlockedUsersCount: number;
totalNewUsersCountThisMonth: number;
}


export enum UsersSortBy {
  DateCreated=1,
  Name=2,
}

export enum UsersSortDirection {
  Ascending=1,
  Descending=2,
}

export enum UserStatus {
  Active = 1,
  Blocked = 2,
}