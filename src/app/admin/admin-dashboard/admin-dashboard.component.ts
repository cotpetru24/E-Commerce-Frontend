import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { ProductDto } from '../../models/product.dto';
import { AdminApiService, AdminStats, Order } from '../../services/api/admin-api.service';
import { ProductApiService } from '../../services/api/product-api.service';
import { UserApiService, User } from '../../services/api/user-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressBarModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule
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
  users: User[] = [];
  filteredUsers: User[] = [];
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
    private productApi: ProductApiService,
    private userApi: UserApiService,
    private snackBar: MatSnackBar
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
      this.adminApi.getDashboardStats().subscribe({
        next: (stats) => {
          this.dashboardStats = stats;
          this.isLoadingStats = false;
        },
        error: (error) => {
          console.error('Error loading dashboard stats:', error);
          this.isLoadingStats = false;
          this.snackBar.open('Failed to load dashboard statistics', 'Close', {
            duration: 3000
          });
        }
      })
    );
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
          this.snackBar.open('Failed to load products', 'Close', {
            duration: 3000
          });
        }
      })
    );
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.productSearchTerm || 
        product.name.toLowerCase().includes(this.productSearchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(this.productSearchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedProductCategory || 
        product.targetAudience === this.selectedProductCategory;
      
      const matchesBrand = !this.selectedProductBrand || 
        product.brand === this.selectedProductBrand;
      
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
            this.snackBar.open('Product deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadProducts(); // Reload products
          },
          error: (error) => {
            console.error('Error deleting product:', error);
            this.snackBar.open('Failed to delete product', 'Close', {
              duration: 3000
            });
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
          
          this.snackBar.open('Product stock updated successfully', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error updating product stock:', error);
          this.snackBar.open('Failed to update product stock', 'Close', {
            duration: 3000
          });
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
          this.snackBar.open('Failed to load users', 'Close', {
            duration: 3000
          });
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

  editUser(user: User): void {
    console.log('Edit user:', user);
    // this.router.navigate(['/admin/users/edit', user.id]);
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user "${user.email}"?`)) {
      this.subscriptions.add(
        this.adminApi.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open('User deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadUsers(); // Reload users
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.snackBar.open('Failed to delete user', 'Close', {
              duration: 3000
            });
          }
        })
      );
    }
  }

  toggleUserStatus(user: User): void {
    const newStatus = !user.isBlocked; // Assuming User interface has isBlocked property
    
    this.subscriptions.add(
      this.adminApi.toggleUserStatus(user.id, newStatus).subscribe({
        next: () => {
          // Update local user
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = { ...user, isBlocked: newStatus };
            this.filterUsers();
          }
          
          this.snackBar.open(`User ${newStatus ? 'blocked' : 'unblocked'} successfully`, 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error updating user status:', error);
          this.snackBar.open('Failed to update user status', 'Close', {
            duration: 3000
          });
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
      this.adminApi.getAllOrders().subscribe({
        next: (response) => {
          this.orders = response.orders;
          this.filteredOrders = response.orders;
          this.totalItems = response.total;
          this.isLoadingOrders = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.isLoadingOrders = false;
          this.snackBar.open('Failed to load orders', 'Close', {
            duration: 3000
          });
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
          
          this.snackBar.open('Order status updated successfully', 'Close', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error updating order status:', error);
          this.snackBar.open('Failed to update order status', 'Close', {
            duration: 3000
          });
        }
      })
    );
  }

  cancelOrder(order: Order): void {
    if (confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      this.subscriptions.add(
        this.adminApi.cancelOrder(order.id).subscribe({
          next: () => {
            this.snackBar.open('Order cancelled successfully', 'Close', {
              duration: 3000
            });
            this.loadOrders(); // Reload orders
          },
          error: (error) => {
            console.error('Error cancelling order:', error);
            this.snackBar.open('Failed to cancel order', 'Close', {
              duration: 3000
            });
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

  getUserStatusColor(user: User): string {
    return user.isBlocked ? 'warn' : 'primary';
  }

  getUserStatusText(user: User): string {
    return user.isBlocked ? 'Blocked' : 'Active';
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  // Utility method for Math.max to use in template
  getMaxValue(a: number, b: number): number {
    return Math.max(a, b);
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