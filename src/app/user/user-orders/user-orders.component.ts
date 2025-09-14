import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { OrderApiService } from '../../services/api/order-api.service';
import { OrderDto, GetOrdersRequestDto, GetOrdersResponseDto } from '../../models/order.dto';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss'
})
export class UserOrdersComponent implements OnInit {
  currentFilter = 'all';
  selectedOrder: OrderDto | null = null;
  
  allOrders: OrderDto[] = [];
  filteredOrders: OrderDto[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  totalCount = 0;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private orderApiService: OrderApiService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    // Check if user is logged in before making API call
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      console.warn('No access token found, user may not be logged in');
      this.toastService.error('Please log in to view your orders');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    
    const request: GetOrdersRequestDto = {
      page: this.currentPage,
      pageSize: this.pageSize,
      ...(this.currentFilter !== 'all' && { orderStatus: this.currentFilter })
    };

    this.orderApiService.getOrders(request).subscribe({
      next: (response: GetOrdersResponseDto) => {
        this.allOrders = response.orders;
        this.filteredOrders = response.orders;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.toastService.error('Failed to load orders');
        this.isLoading = false;
      }
    });
  }

  filterOrders(filter: string) {
    this.currentFilter = filter;
    this.currentPage = 1; // Reset to first page when filtering
    this.loadOrders();
  }

  loadPage(page: number) {
    this.currentPage = page;
    this.loadOrders();
  }

  trackOrder(order: OrderDto) {
    this.selectedOrder = order;
    // Show tracking modal using Bootstrap
    const modal = new (window as any).bootstrap.Modal(document.getElementById('trackingModal'));
    modal.show();
  }

  viewOrderDetails(orderId: number) {
    this.router.navigate(['/account/orders', orderId]);
  }

  reorder(order: OrderDto) {
    // Implement reorder functionality
    this.toastService.success('Items added to cart for reorder!');
    this.router.navigate(['/cart']);
  }

  cancelOrder(order: OrderDto) {
    if (confirm('Are you sure you want to cancel this order?')) {
      // Implement cancel order functionality
      this.toastService.success('Order cancelled successfully!');
      this.loadOrders(); // Reload orders
    }
  }

  getItemCount(order: OrderDto): number {
    return order.orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  getStatusBadgeClass(status: string | undefined): string {
    if (!status) return 'bg-secondary';
    
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-success';
      case 'shipped':
        return 'bg-info';
      case 'processing':
        return 'bg-warning';
      case 'pending':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getTimelineIcon(status: string): string {
    switch (status) {
      case 'ordered':
        return 'bi-cart-check';
      case 'processing':
        return 'bi-gear';
      case 'shipped':
        return 'bi-truck';
      case 'out_for_delivery':
        return 'bi-box-seam';
      case 'delivered':
        return 'bi-check-circle';
      default:
        return 'bi-circle';
    }
  }
} 