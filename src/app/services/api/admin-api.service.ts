import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, delay } from 'rxjs/operators';
import { AdminBrandDto, AdminProductAudienceDto, AdminProductDto, GetProductsAdminRequestDto, GetProductsAdminResponseDto, ProductDto } from '../../models/product.dto';
import { Audience } from '../../models/audience.enum';
import { BaseApiService } from './base-api.service';
import { StorageService } from '../storage.service';
import {
  AdminOrderDto,
  GetAllOrdersRequestDto,
  GetAllOrdersResponseDto,
  GetAllUsersRequestDto,
  GetAllUsersResponseDto,
  GetOrdersResponseDto,
  SortBy,
  SortDirection,
  UpdateOrderStatusRequestDto,
  UserRole,
} from '../../models';

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
  outOfStockProducts: number;
  pendingOrders: number;
  newUsersToday: number;
  newOrdersToday: number;
  todayRevenue: number;
  recentActivity: {
    source: 'User' | 'Product' | 'Order' | 'Payment' | 'Shipping';
    userGuid?: string;
    userEmail?: string;
    id: number;
    description: string;
    createdAt: string;
  }[];
}

export interface Order {
  id: number;
  userId: number;
  userEmail: string;
  orderNumber: string;
  customerName?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole [];
  isBlocked: boolean;
  emailConfirmed?: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  orderCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminApiService extends BaseApiService {
  private readonly endPoint = '/api/admin';

  constructor(
    protected override http: HttpClient,
    protected override storageService: StorageService
  ) {
    super(http, storageService);
  }

  // ============================================================================
  // DASHBOARD & STATISTICS
  // ============================================================================

  /**
   * Get admin dashboard statistics
   */
  getDashboardStats(): Observable<AdminStats> {
    const url = this.buildUrl(`${this.endPoint}/dashboard`);
    this.logRequest('GET', url);

    return this.get<AdminStats>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // PRODUCT MANAGEMENT
  // ============================================================================

  /**
   * Get all products with admin details
   */
  getAllProducts(request: GetProductsAdminRequestDto | null): Observable<GetProductsAdminResponseDto> {
    const url = this.buildUrl(`${this.endPoint}/products`);
    const params = this.createParams({
      pageNumber: request?.pageNumber || 1,
      pageSize: request?.pageSize || 10,
      ...(request?.searchTerm && { searchTerm: request.searchTerm }),
      ...(request?.productBrand && { productBrand: request.productBrand }),
      ...(request?.isActive !== null 
        && request?.isActive !== undefined
        && { isActive: request.isActive }),
      ...(request?.productStockStatus && { productStockStatus: request.productStockStatus }),
      ...(request?.sortBy && { sortBy: request.sortBy }),
      ...(request?.sortDirection && { sortDirection: request.sortDirection }),
      ...(request?.productCategory && { productCategory: request.productCategory }),

    });
    this.logRequest('GET', url, params);

    return this.get<any>(url, { params: params }).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  getProductById(productId: number): Observable<AdminProductDto> {
    const url = this.buildUrl(`${this.endPoint}/products/${productId}`);
    this.logRequest('GET', url);

    return this.get<AdminProductDto>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

    getProductBrands(): Observable<AdminBrandDto []> {
    const url = this.buildUrl(`${this.endPoint}/products/brands`);
    this.logRequest('GET', url);

    return this.get<AdminBrandDto []>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  getProductAudience(): Observable<AdminProductAudienceDto []> {
    const url = this.buildUrl(`${this.endPoint}/products/audience`);
    this.logRequest('GET', url);
    
    return this.get<AdminProductAudienceDto []>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Create new product
   */
  createProduct(product: AdminProductDto): Observable<AdminProductDto> {
    const url = this.buildUrl(`${this.endPoint}/products`);
    this.logRequest('POST', url, product);

    return this.post<AdminProductDto>(url, product).pipe(
      tap((response) => this.logResponse('POST', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update product
   */
  updateProduct(id: number, product: AdminProductDto): Observable<ProductDto> {
    const url = this.buildUrl(`${this.endPoint}/products/${id}`);
    this.logRequest('PUT', url, product);

    return this.put<ProductDto>(url, product).pipe(
      tap((response) => this.logResponse('PUT', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Delete product
   */
  deleteProduct(id: number): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/products/${id}`);
    this.logRequest('DELETE', url);

    return this.delete<any>(url).pipe(
      tap((response) => this.logResponse('DELETE', url, response)),
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // ORDER MANAGEMENT
  // ============================================================================

  /**
   * Get all orders
   */
  getAllOrders(
    request: GetAllOrdersRequestDto | null
  ): Observable<GetAllOrdersResponseDto> {
    const url = this.buildUrl(`${this.endPoint}/orders`);
    const params = this.createParams({
      pageNumber: request?.pageNumber || 1,
      pageSize: request?.pageSize || 10,
      ...(request?.searchTerm && { searchTerm: request.searchTerm }),
      ...(request?.orderStatus && { statusFilter: request.orderStatus }),
      ...(request?.fromDate && { fromDate: request.fromDate.toISOString() }),
      ...(request?.toDate && { toDate: request.toDate.toISOString() }),
      ...(request?.sortBy !== undefined &&
        request?.sortBy !== null && { sortBy: request.sortBy }),
      ...(request?.sortDirection !== undefined &&
        request?.sortDirection !== null && {
          sortDirection: request.sortDirection,
        }),
    });

    this.logRequest('GET', url, request);

    return this.get<any>(url, { params }).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Get user orders by userId
   */
  getUserOrders(
    userId: string,
    params?: {
      pageNumber?: number;
      pageSize?: number;
      statusFilter?: string;
      fromDate?: Date;
      toDate?: Date;
    }
  ): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/users/${userId}/orders`);
    const queryParams = this.createParams({
      pageNumber: params?.pageNumber || 1,
      pageSize: params?.pageSize || 10,
      ...(params?.statusFilter && { statusFilter: params.statusFilter }),
      ...(params?.fromDate && { fromDate: params.fromDate.toISOString() }),
      ...(params?.toDate && { toDate: params.toDate.toISOString() }),
    });
    this.logRequest('GET', url, params);

    return this.get<any>(url, { params: queryParams }).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Get specific order
   */
  getOrder(orderId: number): Observable<AdminOrderDto> {
    const url = this.buildUrl(`${this.endPoint}/orders/${orderId}`);
    this.logRequest('GET', url);

    return this.get<any>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update order status
   */
  updateOrderStatus(
    orderId: number,
    statusData: UpdateOrderStatusRequestDto
  ): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/orders/${orderId}/status`);
    this.logRequest('PUT', url, statusData);

    return this.put<any>(url, statusData).pipe(
      tap((response) => this.logResponse('PUT', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: number, reason?: string): Observable<void> {
    const url = this.buildUrl(`${this.endPoint}/orders/${orderId}/cancel`);
    const body = reason ? { reason } : {};
    this.logRequest('PUT', url, body);

    return this.put<void>(url, body).pipe(
      tap((response) => this.logResponse('PUT', url, response)),
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================

  /**
   * Get all users
   */
  getAllUsers(request: GetAllUsersRequestDto): Observable<GetAllUsersResponseDto> {
    const url = this.buildUrl(`${this.endPoint}/users`);
    const params = this.createParams({
      pageNumber: request?.pageNumber || 1,
      pageSize: request?.pageSize || 10,
      ...(request?.searchTerm && { searchTerm: request.searchTerm }),
      ...(request?.sortDirection !== undefined &&
          request?.sortDirection !== null && {
            sortDirection: request.sortDirection,
      }),
      ...(request?.sortBy !== undefined &&
          request?.sortBy !== null && { sortBy: request.sortBy 
      }),
      ...(request?.userStatus && { userStatus: request.userStatus }),
      ...(request?.userRole && { userRole: request.userRole}),
    });
    
    this.logRequest('GET', url, params);

    return this.get<any>(url, { params: params }).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Get user details
   */
  getUser(userId: string): Observable<any> {
    const url = this.buildUrl(`/admin/users/${userId}`);
    this.logRequest('GET', url);

    return this.get<any>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Get user by ID (for user profile view)
   */
  getUserById(userId: string): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/users/${userId}`);
    this.logRequest('GET', url);

    return this.get<any>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update user (admin can update any user)
   */
  updateUser(userId: string, updates: any): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/users/${userId}`);
    this.logRequest('PUT', url, updates);

    return this.put<any>(url, updates).pipe(
      tap((response) => this.logResponse('PUT', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Delete user
   */
  deleteUser(userId: string): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/users/${userId}`);
    this.logRequest('DELETE', url);

    return this.delete<any>(url).pipe(
      tap((response) => this.logResponse('DELETE', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Create new user
   */
  createUser(userData: any): Observable<any> {
    const url = this.buildUrl('/admin/users');
    this.logRequest('POST', url, userData);

    return this.post<any>(url, userData).pipe(
      tap((response) => this.logResponse('POST', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Block/unblock user
   */
  toggleUserStatus(userId: string, isBlocked: boolean, roles: UserRole[]): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/users/${userId}`);
    const updateData = { isBlocked: isBlocked, roles:roles };
    this.logRequest('PUT', url, updateData);

    return this.put<any>(url, updateData).pipe(
      tap((response) => this.logResponse('PUT', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update user password (admin can change any user's password)
   */
  updateUserPassword(
    userId: string,
    passwordData: { newPassword: string }
  ): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/users/${userId}/password`);
    this.logRequest('PUT', url, { password: '***' }); // Don't log actual password

    return this.put<any>(url, passwordData).pipe(
      tap((response) => this.logResponse('PUT', url, response)),
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
    const categories = [
      { id: 1, name: 'Men', description: "Men's footwear" },
      { id: 2, name: 'Women', description: "Women's footwear" },
      { id: 3, name: 'Unisex', description: 'Unisex footwear' },
    ];

    return of(categories).pipe(delay(300), catchError(this.handleError));
  }

  /**
   * Create category
   */
  createCategory(category: {
    name: string;
    description?: string;
  }): Observable<any> {
    const newCategory = {
      id: Math.floor(Math.random() * 1000) + 10,
      ...category,
    };

    return of(newCategory).pipe(delay(600), catchError(this.handleError));
  }

  /**
   * Update category
   */
  updateCategory(id: number, updates: any): Observable<any> {
    const updatedCategory = { id, ...updates };
    return of(updatedCategory).pipe(delay(500), catchError(this.handleError));
  }

  /**
   * Delete category
   */
  deleteCategory(id: number): Observable<void> {
    return of(void 0).pipe(delay(400), catchError(this.handleError));
  }

  /**
   * Get all brands
   */
  getBrands(): Observable<any[]> {
    const brands = [
      { id: 1, name: 'Nike', description: 'Just Do It' },
      { id: 2, name: 'Adidas', description: 'Impossible Is Nothing' },
      { id: 3, name: 'Converse', description: 'Classic Style' },
      { id: 4, name: 'Puma', description: 'Forever Faster' },
      { id: 5, name: 'New Balance', description: 'Fearlessly Independent' },
    ];

    return of(brands).pipe(delay(300), catchError(this.handleError));
  }

  /**
   * Create brand
   */
  createBrand(brand: { name: string; description?: string }): Observable<any> {
    const newBrand = {
      id: Math.floor(Math.random() * 1000) + 10,
      ...brand,
    };

    return of(newBrand).pipe(delay(600), catchError(this.handleError));
  }

  /**
   * Update brand
   */
  updateBrand(id: number, updates: any): Observable<any> {
    const updatedBrand = { id, ...updates };
    return of(updatedBrand).pipe(delay(500), catchError(this.handleError));
  }

  /**
   * Delete brand
   */
  deleteBrand(id: number): Observable<void> {
    return of(void 0).pipe(delay(400), catchError(this.handleError));
  }

  // ============================================================================
  // SYSTEM SETTINGS
  // ============================================================================

  /**
   * Get system settings
   */
  getSystemSettings(): Observable<any> {
    const settings = {
      siteName: 'E-Commerce Store',
      contactEmail: 'admin@example.com',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
    };

    return of(settings).pipe(delay(300), catchError(this.handleError));
  }

  /**
   * Update system settings
   */
  updateSystemSettings(settings: any): Observable<any> {
    return of(settings).pipe(delay(800), catchError(this.handleError));
  }
}
