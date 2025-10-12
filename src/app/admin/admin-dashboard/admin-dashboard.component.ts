import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductDto } from '../../models/product.dto';
import { AdminApiService, AdminStats, Order } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';
import { UserDto } from '../../models/user.dto';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
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
  products: ProductDto[] = [];
  filteredProducts: ProductDto[] = [];
  isLoadingProducts = false;
  productSearchTerm = '';
  selectedProductCategory = '';
  selectedProductBrand = '';

  // Product table
  displayedProductColumns: string[] = [
    'id', 'name', 'brand', 'category', 'price', 'stock', 'actions'
  ];

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================
  users: UserDto[] = [];
  filteredUsers: UserDto[] = [];
  isLoadingUsers = false;
  userSearchTerm = '';

  // User table
  displayedUserColumns: string[] = [
    'id', 'email', 'firstName', 'lastName', 'status', 'createdAt', 'actions'
  ];

  // ============================================================================
  // ORDER MANAGEMENT
  // ============================================================================
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoadingOrders = false;
  selectedOrderStatus = '';

  // Order table
  displayedOrderColumns: string[] = [
    'id', 'userEmail', 'total', 'status', 'createdAt', 'actions'
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
    // private productApi: ProductApiService,
    // private userApi: UserApiService,
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
    
      this.adminApi.getDashboardStats().subscribe({
        next: (stats) => {
          this.dashboardStats = stats;
          this.isLoadingStats = false;
        },
        error: (error) => {
          console.error('Error loading dashboard stats:', error);
          this.isLoadingStats = false;
          this.toastService.error('Failed to load dashboard statistics');
        }
      })

  }

  // ============================================================================
  // PRODUCT MANAGEMENT METHODS
  // ============================================================================

  loadProducts(): void {
    this.isLoadingProducts = true;
    
    this.subscriptions.add(
      this.adminApi.getAllProducts().subscribe({
        next: (products) => {
          this.products = products;
          this.filteredProducts = products;
          this.isLoadingProducts = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoadingProducts = false;
          this.toastService.error('Failed to load products');
        }
      })
    );
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.productSearchTerm || 
        product.name.toLowerCase().includes(this.productSearchTerm.toLowerCase()) ||
        product.brandName.toLowerCase().includes(this.productSearchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedProductCategory || 
        product.audience === this.selectedProductCategory;
      
      const matchesBrand = !this.selectedProductBrand || 
        product.brandName === this.selectedProductBrand;
      
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
    // Navigate to edit product page
    console.log('Edit product:', product);
    // this.router.navigate(['/admin/products/edit', product.id]);
  }

  deleteProduct(product: ProductDto): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.subscriptions.add(
        this.adminApi.deleteProduct(product.id).subscribe({
          next: () => {
                      this.toastService.success('Product deleted successfully');
            this.loadProducts(); // Reload products
          },
          error: (error) => {
            console.error('Error deleting product:', error);
                      this.toastService.error('Failed to delete product');
          }
        })
      );
    }
  }

  updateProductStock(product: ProductDto, newStock: number): void {
    this.subscriptions.add(
      this.adminApi.updateProductStock(product.id, newStock).subscribe({
        next: (updatedProduct) => {
          // Update local product
          const index = this.products.findIndex(p => p.id === product.id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
            this.filterProducts();
          }
          
          this.toastService.success('Product stock updated successfully');
        },
        error: (error) => {
          console.error('Error updating product stock:', error);
          this.toastService.error('Failed to update product stock');
        }
      })
    );
  }

  // ============================================================================
  // USER MANAGEMENT METHODS
  // ============================================================================

  loadUsers(): void {
    this.isLoadingUsers = true;
    
    this.subscriptions.add(
      this.adminApi.getAllUsers().subscribe({
        next: (response) => {
          this.users = response.users;
          this.filteredUsers = response.users;
          this.totalItems = response.total;
          this.isLoadingUsers = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.isLoadingUsers = false;
          this.toastService.error('Failed to load users');
        }
      })
    );
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      return !this.userSearchTerm || 
        user.email.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.userSearchTerm.toLowerCase());
    });
  }

  onUserSearchChange(): void {
    this.filterUsers();
  }

  editUser(user: UserDto): void {
    console.log('Edit user:', user);
    // this.router.navigate(['/admin/users/edit', user.id]);
  }

  deleteUser(user: UserDto): void {
    if (confirm(`Are you sure you want to delete user "${user.email}"?`)) {
      this.subscriptions.add(
        this.adminApi.deleteUser(user.id.toString()).subscribe({
          next: () => {
                      this.toastService.success('User deleted successfully');
            this.loadUsers(); // Reload users
          },
          error: (error) => {
            console.error('Error deleting user:', error);
                      this.toastService.error('Failed to delete user');
          }
        })
      );
    }
  }

  toggleUserStatus(user: UserDto): void {
    const newStatus = !user.isBlocked; // Assuming User interface has isBlocked property
    
    this.subscriptions.add(
      this.adminApi.toggleUserStatus(user.id.toString(), newStatus).subscribe({
        next: () => {
          // Update local user
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = { ...user, isBlocked: newStatus };
            this.filterUsers();
          }
          
          this.toastService.success(`User ${newStatus ? 'blocked' : 'unblocked'} successfully`);
        },
        error: (error: any) => {
          console.error('Error updating user status:', error);
          this.toastService.error('Failed to update user status');
        }
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
          this.totalItems = response.totalCount;
          this.isLoadingOrders = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.isLoadingOrders = false;
          this.toastService.error('Failed to load orders');
        }
      })
    );
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      return !this.selectedOrderStatus || order.status === this.selectedOrderStatus;
    });
  }

  onOrderFilterChange(): void {
    this.filterOrders();
  }

  viewOrder(order: Order): void {
    console.log('View order:', order);
    // this.router.navigate(['/admin/orders', order.id]);
  }

  updateOrderStatus(order: Order, newStatus: Order['status']): void {
    this.subscriptions.add(
      this.adminApi.updateOrderStatus(order.id, newStatus).subscribe({
        next: (updatedOrder) => {
          // Update local order
          const index = this.orders.findIndex(o => o.id === order.id);
          if (index !== -1) {
            this.orders[index] = updatedOrder;
            this.filterOrders();
          }
          
          this.toastService.success('Order status updated successfully');
        },
        error: (error) => {
          console.error('Error updating order status:', error);
          this.toastService.error('Failed to update order status');
        }
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
          error: (error) => {
            console.error('Error cancelling order:', error);
                      this.toastService.error('Failed to cancel order');
          }
        })
      );
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warn';
      case 'processing': return 'accent';
      case 'shipped': return 'primary';
      case 'delivered': return 'primary';
      case 'cancelled': return 'warn';
      default: return 'primary';
    }
  }

  getUserStatusColor(user: UserDto): string {
    return user.isBlocked ? 'warn' : 'primary';
  }

  getUserStatusText(user: UserDto): string {
    return user.isBlocked ? 'Blocked' : 'Active';
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return `£${amount.toFixed(2)}`;
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
   * Format time ago for activity timestamps
   */
  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  /**
   * View specific activity item
   */
  viewActivity(activity: any): void {
    console.log('Viewing activity:', activity);
    
    // Navigate based on activity source
    switch (activity.source.toLowerCase()) {
      case 'user':
        // Navigate to user management or specific user
        if (activity.userGuid) {
        this.toastService.warning('In viewActivity - navigate to user');
        } else {
        this.toastService.error('Failed to navidate to activity.')       
        }
        break;

      case 'product':
        if (activity.id) {
        this.toastService.warning('In viewActivity - navigate to product');
        } else {
        this.toastService.error('Failed to navidate to activity.')       
        }
        break;

      case 'order':
        if (activity.id) {
          this.router.navigate(['/admin/orders', activity.id], {
            queryParams: { from: 'dashboard' }
          });
        } else {
          this.toastService.error('Failed to navigate to activity.');
        }
        break;

      default:
        console.log('Unknown activity source:', activity.source);
    }
  }

  /**
   * View all activity (navigate to activity log page)
   */
  viewAllActivity(): void {
    this.toastService.info('View all - feature coming soon!');
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