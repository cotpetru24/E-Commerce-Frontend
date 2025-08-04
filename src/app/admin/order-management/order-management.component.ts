import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from '../../services/api/admin-api.service';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
}

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit, OnDestroy {
  // Orders data
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  paginatedOrders: Order[] = [];
  isLoading = false;

  // Search and filters
  searchTerm = '';
  selectedStatus = '';
  selectedDateRange = '';
  sortBy = 'date-desc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Statistics
  orderStats: OrderStats = {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0
  };

  // Math utility for template
  Math = Math;

  private subscriptions = new Subscription();

  constructor(
    private adminApi: AdminApiService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadOrders(): void {
    this.isLoading = true;
    
    this.subscriptions.add(
      this.adminApi.getAllOrders().subscribe({
        next: (response) => {
          this.orders = response.orders;
          this.applyFilters();
          this.calculateStats();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.isLoading = false;
          this.toastService.error('Failed to load orders');
        }
      })
    );
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
        order.id.toString().includes(this.searchTerm) ||
        order.userEmail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (order.customerName && order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = !this.selectedStatus || 
        order.status === this.selectedStatus;
      
      const matchesDateRange = !this.selectedDateRange || 
        this.isInDateRange(order.createdAt, this.selectedDateRange);
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });

    this.sortOrders();
    this.updatePagination();
  }

  sortOrders(): void {
    this.filteredOrders.sort((a, b) => {
      switch (this.sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'total-desc':
          return b.total - a.total;
        case 'total-asc':
          return a.total - b.total;
        default:
          return 0;
      }
    });
  }

  isInDateRange(date: Date | string, range: string): boolean {
    const orderDate = new Date(date);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case 'today':
        return orderDate >= startOfDay;
      case 'week':
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        return orderDate >= startOfWeek;
      case 'month':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return orderDate >= startOfMonth;
      case 'quarter':
        const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        return orderDate >= startOfQuarter;
      default:
        return true;
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  calculateStats(): void {
    this.orderStats = {
      total: this.orders.length,
      pending: this.orders.filter(o => o.status === 'pending').length,
      processing: this.orders.filter(o => o.status === 'processing').length,
      completed: this.orders.filter(o => o.status === 'delivered').length
    };
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'badge bg-warning';
      case 'processing': return 'badge bg-info';
      case 'shipped': return 'badge bg-primary';
      case 'delivered': return 'badge bg-success';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getPaymentClass(status: string): string {
    switch (status) {
      case 'paid': return 'badge bg-success';
      case 'pending': return 'badge bg-warning';
      case 'failed': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  formatTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString();
  }

  viewOrder(order: Order): void {
    // Navigate to order detail view
    this.router.navigate(['/admin/orders', order.id]);
  }

  updateStatus(order: Order): void {
    // Implement status update modal
    this.toastService.info('Status update functionality coming soon!');
  }

  markShipped(order: Order): void {
    if (confirm(`Mark order #${order.id} as shipped?`)) {
      this.subscriptions.add(
        this.adminApi.updateOrderStatus(order.id, 'shipped').subscribe({
          next: () => {
            this.toastService.success('Order marked as shipped');
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error updating order status:', error);
            this.toastService.error('Failed to update order status');
          }
        })
      );
    }
  }

  cancelOrder(order: Order): void {
    if (confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      this.subscriptions.add(
        this.adminApi.cancelOrder(order.id).subscribe({
          next: () => {
            this.toastService.success('Order cancelled successfully');
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error cancelling order:', error);
            this.toastService.error('Failed to cancel order');
          }
        })
      );
    }
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  exportOrders(): void {
    // Implement export functionality
    this.toastService.info('Export functionality coming soon!');
  }
} 