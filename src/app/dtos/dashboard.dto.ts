export interface DashboardStatsDto {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  todayRevenue: number;
  thisMonthRevenue: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  newOrdersToday: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  recentActivity: RecentActivityDto[];
}

export interface RecentActivityDto {
  source: 'User' | 'Product' | 'Order' | 'Payment' | 'Shipping';
  userGuid?: string;
  userEmail?: string;
  id: number;
  description: string;
  createdAt: string;
}
