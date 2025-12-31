import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from '../../services/api/admin-api.service';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ToastService } from '../../services/toast.service';
import {
  AdminOrderDto,
  AdminOrdersStatsDto,
  GetAllOrdersRequestDto,
  OrderStatus,
  SortBy,
  SortDirection,
  UpdateOrderStatusRequestDto,
} from '../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
}

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalDialogComponent],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
})
export class OrderManagementComponent implements OnInit, OnDestroy {
  // Orders data
  orders: AdminOrderDto[] = [];
  isLoading = false;
  initialInit: boolean = true;

  searchTerm: string | null = null;
  selectedStatus: OrderStatus | null = null;

  selectedDateRange = '';
  sortBy = 'date-desc';

  // Pagination
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalQueryCount = 0;

  adminOrdersStats: AdminOrdersStatsDto = {
    totalOrdersCount: 0,
    totalDeliveredOrdersCount: 0,
    totalPendingOrdersCount: 0,
    totalProcessingOrdersCount: 0,
  };

  // Math utility for template
  Math = Math;

  private subscriptions = new Subscription();

  constructor(
    private adminApiService: AdminApiService,
    private router: Router,
    private toastService: ToastService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.initialInit) {
      this.currentPage = 1;
      this.initialInit = false;
    }
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadOrders(): void {
    this.isLoading = true;

    const now = new Date();
    let fromDate: Date | null = null;
    let toDate: Date | null = null;

    switch (this.selectedDateRange) {
      case 'today':
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        toDate = new Date();
        break;
      case 'week':
        fromDate = new Date(now);
        fromDate.setDate(now.getDate() - now.getDay());
        toDate = new Date();
        break;
      case 'month':
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        toDate = new Date();
        break;
      case 'quarter':
        fromDate = new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3,
          1
        );
        toDate = new Date();
        break;
      default:
        fromDate = null;
    }

    const [sortByField, sortDir] = this.sortBy.split('-');

    const getAllOrdersRequest: GetAllOrdersRequestDto = {
      fromDate: fromDate ? fromDate : null,
      toDate: toDate ? toDate : null,
      orderStatus: this.selectedStatus,
      pageNumber: this.currentPage,
      pageSize: this.itemsPerPage,
      searchTerm: this.searchTerm,
      sortBy: sortByField === 'total' ? SortBy.Total : SortBy.DateCreated,
      sortDirection:
        sortDir === 'asc' ? SortDirection.Ascending : SortDirection.Descending,
    };

    this.subscriptions.add(
      this.adminApiService.getAllOrders(getAllOrdersRequest).subscribe({
        next: (response) => {
          this.orders = response.orders;
          this.adminOrdersStats = response.adminOrdersStats;
          this.currentPage = response.pageNumber;
          this.totalPages = response.totalPages;
          this.itemsPerPage = response.pageSize;
          this.totalQueryCount = response.totalQueryCount;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.isLoading = false;
          this.toastService.error('Failed to load orders');
        },
      })
    );
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  isInDateRange(date: Date | string, range: string): boolean {
    const orderDate = new Date(date);
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

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
        const startOfQuarter = new Date(
          now.getFullYear(),
          Math.floor(now.getMonth() / 3) * 3,
          1
        );
        return orderDate >= startOfQuarter;
      default:
        return true;
    }
  }

  updatePagination(): void {
    if (!this.isLoading) {
      this.loadOrders();
    }
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

  getStatusClass(status?: string): string {
    if (!status) {
      return 'badge bg-secondary';
    }
    switch (status) {
      case 'Pending':
      case 'pending':
        return 'badge bg-warning';
      case 'Processing':
      case 'processing':
        return 'badge bg-info';
      case 'Shipped':
      case 'shipped':
        return 'badge bg-primary';
      case 'Delivered':
      case 'delivered':
        return 'badge bg-success';
      case 'Cancelled':
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getPaymentClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'badge bg-success';
      case 'Refunded':
        return 'badge bg-warning';
      case 'Failed':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  }

  formatTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString();
  }

  viewOrder(order: AdminOrderDto): void {
    // Navigate to admin order detail view
    this.router.navigate(['/admin/orders', order.id]);
  }

  updateOrderStatus(order: AdminOrderDto): void {
    const modalRef = this.modalService.open(ModalDialogComponent, {
      size: 'md',
      backdrop: 'static',
    });

    modalRef.componentInstance.title = 'Update Order Status';
    modalRef.componentInstance.message = 'Select the new order status';
    modalRef.componentInstance.modalType = 'updateOrderStatus';
    modalRef.componentInstance.options = [
      { label: 'Pending', value: OrderStatus.pending },
      { label: 'Processing', value: OrderStatus.processing },
      { label: 'Shipped', value: OrderStatus.shipped },
      { label: 'Delivered', value: OrderStatus.delivered },
      { label: 'Refunded', value: OrderStatus.refunded },
      { label: 'Returned', value: OrderStatus.returned },
    ];
    modalRef.result.then((result: OrderStatus[]) => {
      if (result && result.length > 0) {
        const selectedStatus = result[0];
        this.isLoading = true;

        const statusData: UpdateOrderStatusRequestDto = {
          orderStatusId: selectedStatus,
          notes: 'testing the notes',
        };

        this.adminApiService
          .updateOrderStatus(order.id, statusData)
            .subscribe({
              next: () => {
            this.toastService.success('Order status updated successfully!');
            this.loadOrders();
            this.isLoading = false;
          },
          error: (err) => {
            if (err.status === 404) {
              this.toastService.warning(
                'Order not found or cannot be updated.'
              );
            } else {
              this.toastService.error('Failed to update order status.');
            }
            this.isLoading = false;
          },
        });
      }
    });
  }

  markShipped(order: AdminOrderDto): void {
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Cancel Order';
    modalRef.componentInstance.message =
      'Are you sure you want to mark this order as Shipped?';
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result) => {
      if (result === true) {
        this.isLoading = true;

        const statusData: UpdateOrderStatusRequestDto = {
          // orderStatusId: 5,
          orderStatusId: OrderStatus.shipped,
          notes: 'Order marked as shipped by admin',
        };

        this.adminApiService.updateOrderStatus(order.id, statusData).subscribe({
          next: () => {
            this.toastService.success('Order marked as shipped successfully!');
            this.loadOrders();
            this.isLoading = false;
          },
          error: (err) => {
            if (err.status === 404) {
              this.toastService.warning(
                'Order not found or cannot be updated.'
              );
            } else {
              this.toastService.error('Failed to mark the order as shipped.');
            }
            this.isLoading = false;
          },
        });
      }
    });
  }

  cancelOrder(order: AdminOrderDto): void {
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Cancel Order';
    modalRef.componentInstance.message =
      'Are you sure you want to cancel this order?';
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result) => {
      if (result === true) {
        this.isLoading = true;

        const statusData: UpdateOrderStatusRequestDto = {
          orderStatusId: OrderStatus.cancelled,
          notes: 'Order cancelled by admin',
        };

        this.adminApiService.updateOrderStatus(order.id, statusData).subscribe({
          next: (response) => {
            const target = this.orders.find((o) => o.id === order.id);
            if (target) {
              target.orderStatusName = 'Cancelled';

              this.orders = [...this.orders];
            }

            this.toastService.success('Order cancelled successfully!');
            this.isLoading = false;
          },
          error: (err) => {
            if (err.status === 404) {
              this.toastService.warning(
                'Order not found or cannot be cancelled.'
              );
            } else {
              this.toastService.error('Failed to cancel order.');
            }
            this.isLoading = false;
          },
        });
      }
    });
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  exportOrders(): void {
    // Implement export functionality
    this.toastService.info('Export functionality coming soon!');
  }

  getOrderItemsCount(order: AdminOrderDto): number {
    return (
      order.orderItems.reduce(
        (orderItmsQuantity, item) => orderItmsQuantity + item.quantity,
        0
      ) ?? 0
    );
  }

  resetFilters(): void {
    this.searchTerm = null;
    this.selectedStatus = null;
    this.selectedDateRange = '';
    this.sortBy = 'date-desc';
    this.currentPage = 1;
    this.loadOrders();
  }
}
