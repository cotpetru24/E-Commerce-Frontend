import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AdminProductDto, ProductDto } from '../../models/product.dto';
import {
  AdminApiService,
  AdminStats,
  AdminUser,
  Order,
} from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { UtilsService } from '../../services/utils.service';
import { UserDto } from '../../models/user.dto';
import {
  AdminOrderDto,
  GetAllUsersRequestDto,
  UpdateOrderStatusRequestDto,
  UsersSortBy,
  UsersSortDirection,
} from '../../models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  // ============================================================================
  // DASHBOARD STATISTICS
  // ============================================================================
  dashboardStats: AdminStats | null = null;
  isLoadingStats = false;

  // ============================================================================
  // PRODUCT MANAGEMENT
  // ============================================================================
  products: AdminProductDto[] = [];
  filteredProducts: AdminProductDto[] = [];
  isLoadingProducts = false;
  productSearchTerm = '';
  selectedProductCategory = '';
  selectedProductBrand = '';

  // Product table
  displayedProductColumns: string[] = [
    'id',
    'name',
    'brand',
    'category',
    'price',
    'stock',
    'actions',
  ];

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  isLoadingUsers = false;
  userSearchTerm = '';

  // User table
  displayedUserColumns: string[] = [
    'id',
    'email',
    'firstName',
    'lastName',
    'status',
    'createdAt',
    'actions',
  ];

  // ============================================================================
  // ORDER MANAGEMENT
  // ============================================================================
  orders: AdminOrderDto[] = [];
  filteredOrders: AdminOrderDto[] = [];
  isLoadingOrders = false;
  selectedOrderStatus = '';

  // Order table
  displayedOrderColumns: string[] = [
    'id',
    'userEmail',
    'total',
    'status',
    'createdAt',
    'actions',
  ];

  // ============================================================================
  // PAGINATION
  // ============================================================================
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // ============================================================================
  // SUBSCRIPTIONS
  // ============================================================================
  private subscriptions = new Subscription();

  constructor(
    private adminApi: AdminApiService,
    private toastService: ToastService,
    private router: Router,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ============================================================================
  // DASHBOARD METHODS
  // ============================================================================

  loadDashboardData(): void {
    this.isLoadingStats = true;

    this.subscriptions.add(
      this.adminApi.getDashboardStats()
        .pipe(finalize(() => (this.isLoadingStats = false)))
        .subscribe({
          next: (stats) => {
            this.dashboardStats = stats;
          },
          error: () => {
            this.toastService.error('Failed to load dashboard statistics');
          },
        })
    );
  }

  // ============================================================================
  // PRODUCT MANAGEMENT METHODS
  // ============================================================================

  loadProducts(): void {
    this.isLoadingProducts = true;

    this.subscriptions.add(
      this.adminApi.getAllProducts(null).subscribe({
        next: (response) => {
          this.products = response.products;
          this.filteredProducts = response.products;
          this.isLoadingProducts = false;
        },
        error: () => {
          this.isLoadingProducts = false;
          this.toastService.error('Failed to load products');
        },
      })
    );
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch =
        !this.productSearchTerm ||
        product.name
          .toLowerCase()
          .includes(this.productSearchTerm.toLowerCase()) ||
        (product.brandName ?? '')
          .toLowerCase()
          .includes(this.productSearchTerm.toLowerCase());

      const matchesCategory =
        !this.selectedProductCategory ||
        product.audience === this.selectedProductCategory;

      const matchesBrand =
        !this.selectedProductBrand ||
        (product.brandName ?? '') === this.selectedProductBrand;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }

  onProductSearchChange(): void {
    this.filterProducts();
  }

  onProductFilterChange(): void {
    this.filterProducts();
  }

  editProduct(product: ProductDto): void {
    this.router.navigate(['/admin/products/edit', product.id]);
  }

  deleteProduct(product: ProductDto): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.subscriptions.add(
        this.adminApi.deleteProduct(product.id).subscribe({
          next: () => {
            this.toastService.success('Product deleted successfully');
            this.loadProducts(); // Reload products
          },
          error: () => {
            this.toastService.error('Failed to delete product');
          },
        })
      );
    }
  }


  // ============================================================================
  // USER MANAGEMENT METHODS
  // ============================================================================

  loadUsers(): void {
    this.isLoadingUsers = true;

    const getAllUsersRequest: GetAllUsersRequestDto = {
      pageNumber: 1,
      pageSize: 10,
      userStatus: null,
      sortBy: null,
      sortDirection: null,
    };

    this.subscriptions.add(
      this.adminApi.getAllUsers(getAllUsersRequest).subscribe({
        next: (response) => {
          this.users = response.users;
          this.filteredUsers = response.users;
          this.totalItems = response.totalQueryCount;
          this.isLoadingUsers = false;
        },
        error: () => {
          this.isLoadingUsers = false;
          this.toastService.error('Failed to load users');
        },
      })
    );
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter((user) => {
      return (
        !this.userSearchTerm ||
        user.email.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
        user.firstName
          .toLowerCase()
          .includes(this.userSearchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.userSearchTerm.toLowerCase())
      );
    });
  }

  onUserSearchChange(): void {
    this.filterUsers();
  }

  editUser(user: UserDto): void {
    this.router.navigate(['/admin/users/edit', user.id]);
  }

  deleteUser(user: UserDto): void {
    if (confirm(`Are you sure you want to delete user "${user.email}"?`)) {
      this.subscriptions.add(
        this.adminApi.deleteUser(user.id.toString()).subscribe({
          next: () => {
            this.toastService.success('User deleted successfully');
            this.loadUsers(); // Reload users
          },
          error: () => {
            this.toastService.error('Failed to delete user');
          },
        })
      );
    }
  }

  toggleUserStatus(user: UserDto): void {
    const newStatus = !user.isBlocked; // Assuming User interface has isBlocked property

    this.subscriptions.add(
      this.adminApi
        .toggleUserStatus(user.id.toString(), newStatus, user.roles)
        .subscribe({
          next: () => {
            // Update local user
            const index = this.users.findIndex((u) => u.id === user.id);
            if (index !== -1) {
              this.users[index] = { ...user, isBlocked: newStatus };
              this.filterUsers();
            }

            this.toastService.success(
              `User ${newStatus ? 'blocked' : 'unblocked'} successfully`
            );
          },
          error: () => {
            this.toastService.error('Failed to update user status');
          },
        })
    );
  }

  // ============================================================================
  // ORDER MANAGEMENT METHODS
  // ============================================================================

  loadOrders(): void {
    this.isLoadingOrders = true;

    this.subscriptions.add(
      this.adminApi.getAllOrders(null).subscribe({
        next: (response) => {
          this.orders = response.orders;
          this.filteredOrders = response.orders;
          this.totalItems = response.totalQueryCount;
          this.isLoadingOrders = false;
        },
        error: () => {
          this.isLoadingOrders = false;
          this.toastService.error('Failed to load orders');
        },
      })
    );
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter((order) => {
      return (
        !this.selectedOrderStatus ||
        order.orderStatusName === this.selectedOrderStatus
      );
    });
  }

  onOrderFilterChange(): void {
    this.filterOrders();
  }

  viewOrder(order: Order): void {
    this.router.navigate(['/admin/orders', order.id]);
  }

  updateOrderStatus(order: Order, newStatus: Order['status']): void {
    const statusData: UpdateOrderStatusRequestDto = {
      orderStatusId: 7,
    };

    this.subscriptions.add(
      this.adminApi.updateOrderStatus(order.id, statusData).subscribe({
        next: (updatedOrder) => {
          // Update local order
          const index = this.orders.findIndex((o) => o.id === order.id);
          if (index !== -1) {
            this.orders[index] = updatedOrder;
            this.filterOrders();
          }

          this.toastService.success('Order status updated successfully');
        },
        error: () => {
          this.toastService.error('Failed to update order status');
        },
      })
    );
  }

  cancelOrder(order: Order): void {
    if (confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      this.subscriptions.add(
        this.adminApi.cancelOrder(order.id).subscribe({
          next: () => {
            this.toastService.success('Order cancelled successfully');
            this.loadOrders(); // Reload orders
          },
          error: () => {
            this.toastService.error('Failed to cancel order');
          },
        })
      );
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'warn';
      case 'processing':
        return 'accent';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'primary';
      case 'cancelled':
        return 'warn';
      default:
        return 'primary';
    }
  }

  getUserStatusColor(user: UserDto): string {
    return user.isBlocked ? 'warn' : 'primary';
  }

  getUserStatusText(user: UserDto): string {
    return user.isBlocked ? 'Blocked' : 'Active';
  }


  // Utility method for Math.max to use in template
  getMaxValue(a: number, b: number): number {
    return Math.max(a, b);
  }

  // ============================================================================
  // ACTIVITY METHODS
  // ============================================================================

  /**
   * Get the appropriate Bootstrap icon class based on activity source
   */
  getActivityIcon(source: string): string {
    switch (source.toLowerCase()) {
      case 'user':
        return 'bi-person-plus';
      case 'product':
        return 'bi-box';
      case 'order':
        return 'bi-cart-check';
      case 'payment':
        return 'bi-currency-dollar';
      case 'shipping':
        return 'bi-truck';
      default:
        return 'bi-info-circle';
    }
  }

  /**
   * Format currency amount
   */
  formatCurrency(value: number): string {
    return this.utilsService.formatCurrency(value);
  }

  /**
   * Format time ago for activity timestamps
   */
  formatTimeAgo(dateString: string): string {
    return this.utilsService.formatTimeAgo(dateString);
  }

  /**
   * View specific activity item
   */
  viewActivity(activity: any): void {
    // Navigate based on activity source
    switch (activity.source.toLowerCase()) {
      case 'user':
        // Navigate to user management or specific user
        if (activity.userGuid) {
          this.router.navigate(['/admin/users', activity.userGuid]);
        } else {
          this.toastService.error('Failed to navidate to activity.');
        }
        break;

      case 'product':
        if (activity.id) {
          this.router.navigate(['/products/details', activity.id], {
            queryParams: { from: 'admin-dashboard' },
          });
        } else {
          this.toastService.error('Failed to navidate to activity.');
        }
        break;

      case 'order':
        if (activity.id) {
          this.router.navigate(['/admin/orders', activity.id], {
            queryParams: { from: 'dashboard' },
          });
        } else {
          this.toastService.error('Failed to navigate to activity.');
        }
        break;

      default:
        this.toastService.error('Unknown activity source');
    }
  }

  /**
   * View all activity (navigate to activity log page)
   */
  viewAllActivity(): void {
    this.toastService.info('View all - this feature is out of scope!');
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard(): void {
    this.loadDashboardData();
  }

  onTabChange(event: any): void {
    // Load data based on selected tab
    switch (event.index) {
      case 0: // Dashboard
        this.loadDashboardData();
        break;
      case 1: // Products
        this.loadProducts();
        break;
      case 2: // Users
        this.loadUsers();
        break;
      case 3: // Orders
        this.loadOrders();
        break;
    }
  }
}
