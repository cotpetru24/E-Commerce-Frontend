export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'customer' | 'admin' | 'moderator';
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