import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { ProductDto } from '../../models/product.dto';
import { BaseApiService } from './base-api.service';

// ============================================================================
// ADMIN API SERVICE
// ============================================================================
// Handles all admin-specific API calls
// Note: These endpoints typically require admin authentication

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  pendingOrders: number;
  newUsers: number;
  newOrders: number;
  todayRevenue: number;
  recentActivity: {
    icon: string;
    message: string;
    time: string;
  }[];
}

export interface Order {
  id: number;
  userId: number;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})

//modify the methods to use the base api service class
export class AdminApiService extends BaseApiService {
  private readonly baseUrl = '/api/admin';
  
  constructor(protected override http: HttpClient) {
    super(http)
  }

  // ============================================================================
  // DASHBOARD & STATISTICS
  // ============================================================================

  /**
   * Get admin dashboard statistics
   */
  getDashboardStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.baseUrl}/dashboard/stats`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Get recent orders
   */
  getRecentOrders(limit: number = 10): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/dashboard/recent-orders`, {
      params: { limit: limit.toString() }
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Get revenue chart data
   */
  getRevenueData(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/dashboard/revenue`, {
      params: { period }
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // PRODUCT MANAGEMENT
  // ============================================================================

  /**
   * Get all products with admin details
   */
  getAllProducts(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.baseUrl}/products`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Create new product
   */
  createProduct(product: Omit<ProductDto, 'id'>): Observable<ProductDto> {
    return this.http.post<ProductDto>(`${this.baseUrl}/products`, product).pipe(
      tap(newProduct => console.log('Product created:', newProduct)),
      catchError(this.handleError)
    );
  }

  /**
   * Update product
   */
  updateProduct(id: number, product: Partial<ProductDto>): Observable<ProductDto> {
    return this.http.put<ProductDto>(`${this.baseUrl}/products/${id}`, product).pipe(
      tap(updatedProduct => console.log('Product updated:', updatedProduct)),
      catchError(this.handleError)
    );
  }

  /**
   * Update product stock specifically
   */
  updateProductStock(id: number, stock: number): Observable<ProductDto> {
    return this.http.patch<ProductDto>(`${this.baseUrl}/products/${id}/stock`, { stock }).pipe(
      tap(updatedProduct => console.log('Product stock updated:', updatedProduct)),
      catchError(this.handleError)
    );
  }

  /**
   * Delete product
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`).pipe(
      tap(() => console.log('Product deleted:', id)),
      catchError(this.handleError)
    );
  }

  /**
   * Bulk update product stock
   */
  bulkUpdateStock(updates: { id: number; stock: number }[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/products/bulk-stock`, { updates }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get low stock products
   */
  getLowStockProducts(threshold: number = 10): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.baseUrl}/products/low-stock`, {
      params: { threshold: threshold.toString() }
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }


  // ============================================================================
  // ORDER MANAGEMENT
  // ============================================================================

  /**
   * Get all orders
   */
  getAllOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Observable<{ orders: Order[]; total: number }> {
    return this.http.get<{ orders: Order[]; total: number }>(`${this.baseUrl}/orders`, {
      params: params as any
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Get specific order
   */
  getOrder(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${orderId}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }


  /**
   * Update order status
   */
  updateOrderStatus(orderId: number, status: Order['status']): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/orders/${orderId}/status`, { status }).pipe(
      tap(updatedOrder => console.log('Order status updated:', updatedOrder)),
      catchError(this.handleError)
    );
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: number, reason?: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/orders/${orderId}/cancel`, { reason }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get order statistics
   */
  getOrderStats(): Observable<{
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  }> {
    return this.http.get<any>(`${this.baseUrl}/orders/stats`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================

  /**
   * Get all users
   */
  getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<{ users: any[]; total: number }> {
    return this.http.get<{ users: any[]; total: number }>(`${this.baseUrl}/users`, {
      params: params as any
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Get user details
   */
  getUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Update user (admin can update any user)
   */
  updateUser(userId: number, updates: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/users/${userId}`, updates).pipe(
      tap(updatedUser => console.log('User updated:', updatedUser)),
      catchError(this.handleError)
    );
  }

  /**
   * Delete user
   */
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`).pipe(
      tap(() => console.log('User deleted:', userId)),
      catchError(this.handleError)
    );
  }

  /**
   * Block/unblock user
   */
  toggleUserStatus(userId: number, isBlocked: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/users/${userId}/status`, { isBlocked }).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // CATEGORY & BRAND MANAGEMENT
  // ============================================================================

  /**
   * Get all categories
   */
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Create category
   */
  createCategory(category: { name: string; description?: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/categories`, category).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update category
   */
  updateCategory(id: number, updates: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/categories/${id}`, updates).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete category
   */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get all brands
   */
  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/brands`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Create brand
   */
  createBrand(brand: { name: string; description?: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/brands`, brand).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update brand
   */
  updateBrand(id: number, updates: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/brands/${id}`, updates).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete brand
   */
  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/brands/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // SYSTEM SETTINGS
  // ============================================================================

  /**
   * Get system settings
   */
  getSystemSettings(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/settings`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Update system settings
   */
  updateSystemSettings(settings: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/settings`, settings).pipe(
      catchError(this.handleError)
    );
  }

} 