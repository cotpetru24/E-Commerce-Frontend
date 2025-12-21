import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, retry, tap, delay } from 'rxjs/operators';
import { GetProductsAdminRequestDto, GetProductsAdminResponseDto, ProductDto } from '../../models/product.dto';
import { Audience } from '../../models/audience.enum';
import { BaseApiService } from './base-api.service';
import {
  AdminOrderDto,
  GetAllOrdersRequestDto,
  GetAllOrdersResponseDto,
  GetAllUsersRequestDto,
  GetAllUsersResponseDto,
  // GetAllOrdersResponseDto,
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

//modify the methods to use the base api service class
export class AdminApiService extends BaseApiService {
  private readonly endPoint = '/api/admin';

  // Mock data for development
  private mockProducts: ProductDto[] = [
    {
      id: 1,
      name: 'Nike Air Max 270',
      brandName: 'Nike',
      price: 129.99,
      stock: 45,
      audience: Audience.Men,
      description: 'Comfortable running shoes with Air Max technology',
      imagePath: 'assets/products/casual-sneaker.png',
      selected: false,
    },
    {
      id: 2,
      name: 'Adidas Ultraboost 22',
      brandName: 'Adidas',
      price: 179.99,
      stock: 8,
      audience: Audience.Women,
      description: 'Premium running shoes with Boost technology',
      imagePath: 'assets/products/running-shoe.png',
      selected: false,
    },
    {
      id: 3,
      name: 'Converse Chuck Taylor',
      brandName: 'Converse',
      price: 59.99,
      stock: 0,
      audience: Audience.Unisex,
      description: 'Classic canvas sneakers',
      imagePath: 'assets/products/retro-sneaker.png',
      selected: false,
    },
    {
      id: 4,
      name: 'Puma RS-X',
      brandName: 'Puma',
      price: 89.99,
      stock: 23,
      audience: Audience.Men,
      description: 'Retro-inspired running shoes',
      imagePath: 'assets/products/retro-sneaker2.png',
      selected: false,
    },
    {
      id: 5,
      name: 'New Balance 574',
      brandName: 'New Balance',
      price: 79.99,
      stock: 15,
      audience: Audience.Women,
      description: 'Classic lifestyle sneakers',
      imagePath: 'assets/products/casual-sneaker-2.png',
      selected: false,
    },
  ];

  private mockUsers: AdminUser[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      roles: [UserRole.Customer],
      isBlocked: false,
      emailConfirmed: true,
      createdAt: new Date('2023-01-15'),
      lastLoginAt: new Date('2024-01-20'),
      orderCount: 5,
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      roles: [UserRole.Customer],
      isBlocked: false,
      emailConfirmed: true,
      createdAt: new Date('2023-03-20'),
      lastLoginAt: new Date('2024-01-19'),
      orderCount: 3,
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      roles: [UserRole.Administrator],
      isBlocked: false,
      emailConfirmed: true,
      createdAt: new Date('2022-11-10'),
      lastLoginAt: new Date('2024-01-20'),
      orderCount: 0,
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@example.com',
      roles: [UserRole.Customer],
      isBlocked: true,
      emailConfirmed: true,
      createdAt: new Date('2023-06-05'),
      lastLoginAt: new Date('2024-01-15'),
      orderCount: 2,
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@example.com',
      roles: [UserRole.Administrator],
      isBlocked: false,
      emailConfirmed: false,
      createdAt: new Date('2024-01-10'),
      lastLoginAt: new Date('2024-01-18'),
      orderCount: 1,
    },
  ];

  private mockOrders: Order[] = [
    {
      id: 1,
      userId: 1,
      userEmail: 'john.doe@example.com',
      orderNumber: 'ORD-2024-001',
      customerName: 'John Doe',
      items: [
        {
          productId: 1,
          productName: 'Nike Air Max 270',
          quantity: 1,
          price: 129.99,
        },
      ],
      total: 129.99,
      status: 'delivered',
      paymentStatus: 'paid',
      itemCount: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-18'),
    },
    {
      id: 2,
      userId: 2,
      userEmail: 'jane.smith@example.com',
      orderNumber: 'ORD-2024-002',
      customerName: 'Jane Smith',
      items: [
        {
          productId: 2,
          productName: 'Adidas Ultraboost 22',
          quantity: 1,
          price: 179.99,
        },
        {
          productId: 5,
          productName: 'New Balance 574',
          quantity: 1,
          price: 79.99,
        },
      ],
      total: 259.98,
      status: 'processing',
      paymentStatus: 'paid',
      itemCount: 2,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-17'),
    },
    {
      id: 3,
      userId: 1,
      userEmail: 'john.doe@example.com',
      orderNumber: 'ORD-2024-003',
      customerName: 'John Doe',
      items: [
        { productId: 4, productName: 'Puma RS-X', quantity: 1, price: 89.99 },
      ],
      total: 89.99,
      status: 'shipped',
      paymentStatus: 'paid',
      itemCount: 1,
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-18'),
    },
    {
      id: 4,
      userId: 5,
      userEmail: 'david.brown@example.com',
      orderNumber: 'ORD-2024-004',
      customerName: 'David Brown',
      items: [
        {
          productId: 3,
          productName: 'Converse Chuck Taylor',
          quantity: 2,
          price: 59.99,
        },
      ],
      total: 119.98,
      status: 'pending',
      paymentStatus: 'pending',
      itemCount: 2,
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
    },
    {
      id: 5,
      userId: 2,
      userEmail: 'jane.smith@example.com',
      orderNumber: 'ORD-2024-005',
      customerName: 'Jane Smith',
      items: [
        {
          productId: 1,
          productName: 'Nike Air Max 270',
          quantity: 1,
          price: 129.99,
        },
      ],
      total: 129.99,
      status: 'cancelled',
      paymentStatus: 'failed',
      itemCount: 1,
      createdAt: new Date('2024-01-19'),
      updatedAt: new Date('2024-01-19'),
    },
  ];

  private mockStats: AdminStats = {
    totalUsers: 1250,
    totalOrders: 3420,
    totalRevenue: 456789.5,
    totalProducts: 156,
    lowStockProducts: 8,
    pendingOrders: 23,
    newUsersToday: 45,
    newOrdersToday: 67,
    todayRevenue: 12345.67,
    recentActivity: [
      {
        source: 'Order',
        id: 2024005,
        description: 'New order #ORD-2024-005 placed by Jane Smith',
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      },
      {
        source: 'User',
        id: 1251,
        userGuid: 'user-guid-1251',
        description: 'New user registration: david.brown@example.com',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      },
      {
        source: 'Product',
        id: 45,
        description: 'Product "Nike Air Max 270" stock updated',
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
      },
      {
        source: 'Shipping',
        id: 2024003,
        description: 'Order #ORD-2024-003 shipped to John Doe',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        source: 'Payment',
        id: 2024002,
        description: 'Payment received for order #ORD-2024-002',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      },
    ],
  };

  constructor(protected override http: HttpClient) {
    super(http);
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

  /**
   * Get recent orders
   */
  getRecentOrders(limit: number = 10): Observable<Order[]> {
    const recentOrders = this.mockOrders
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);

    return of(recentOrders).pipe(delay(300), catchError(this.handleError));
  }

  /**
   * Get revenue chart data
   */
  getRevenueData(
    period: 'daily' | 'weekly' | 'monthly' = 'monthly'
  ): Observable<any[]> {
    // Mock revenue data
    const mockRevenueData = [
      { date: '2024-01-01', revenue: 12345.67 },
      { date: '2024-01-02', revenue: 15678.9 },
      { date: '2024-01-03', revenue: 13456.78 },
      { date: '2024-01-04', revenue: 18901.23 },
      { date: '2024-01-05', revenue: 16789.45 },
    ];

    return of(mockRevenueData).pipe(delay(400), catchError(this.handleError));
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

  /**
   * Create new product
   */
  createProduct(product: any): Observable<any> {
    const url = this.buildUrl('/admin/products');
    this.logRequest('POST', url, product);

    return this.post<any>(url, product).pipe(
      tap((response) => this.logResponse('POST', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update product
   */
  updateProduct(id: number, product: any): Observable<any> {
    const url = this.buildUrl(`/admin/products/${id}`);
    this.logRequest('PUT', url, product);

    return this.put<any>(url, product).pipe(
      tap((response) => this.logResponse('PUT', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update product stock specifically
   */
  updateProductStock(id: number, stock: number): Observable<ProductDto> {
    const index = this.mockProducts.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.mockProducts[index].stock = stock;
      return of(this.mockProducts[index]).pipe(
        delay(400),
        tap((updatedProduct) =>
          console.log('Product stock updated:', updatedProduct)
        ),
        catchError(this.handleError)
      );
    }
    throw new Error('Product not found');
  }

  /**
   * Delete product
   */
  deleteProduct(id: number): Observable<any> {
    const url = this.buildUrl(`/admin/products/${id}`);
    this.logRequest('DELETE', url);

    return this.delete<any>(url).pipe(
      tap((response) => this.logResponse('DELETE', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Bulk update product stock
   */
  bulkUpdateStock(updates: { id: number; stock: number }[]): Observable<void> {
    updates.forEach((update) => {
      const index = this.mockProducts.findIndex((p) => p.id === update.id);
      if (index !== -1) {
        this.mockProducts[index].stock = update.stock;
      }
    });

    return of(void 0).pipe(delay(1000), catchError(this.handleError));
  }

  /**
   * Get low stock products
   */
  getLowStockProducts(threshold: number = 10): Observable<ProductDto[]> {
    const lowStockProducts = this.mockProducts.filter(
      (p) => p.stock <= threshold
    );
    return of(lowStockProducts).pipe(delay(400), catchError(this.handleError));
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
    const index = this.mockOrders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      this.mockOrders[index].status = 'cancelled';
      this.mockOrders[index].updatedAt = new Date();
      return of(void 0).pipe(delay(500), catchError(this.handleError));
    }
    throw new Error('Order not found');
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
    const stats = {
      total: this.mockOrders.length,
      pending: this.mockOrders.filter((o) => o.status === 'pending').length,
      processing: this.mockOrders.filter((o) => o.status === 'processing')
        .length,
      shipped: this.mockOrders.filter((o) => o.status === 'shipped').length,
      delivered: this.mockOrders.filter((o) => o.status === 'delivered').length,
      cancelled: this.mockOrders.filter((o) => o.status === 'cancelled').length,
    };

    return of(stats).pipe(delay(300), catchError(this.handleError));
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
