import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { OrderApiService } from '../../services/api/order-api.service';
import {
  OrderDto,
  GetOrdersRequestDto,
  GetOrdersResponseDto,
} from '../../models/order.dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss',
})

export class UserOrdersComponent implements OnInit {
  currentFilter = 'all';
  selectedOrder: OrderDto | null = null;
  allOrders: OrderDto[] = [];
  cachedOrders: OrderDto[] = [];
  filteredOrders: OrderDto[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 100;
  totalPages = 0;
  totalCount = 0;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private orderApiService: OrderApiService,
    private modalService: NgbModal,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const token = this.storageService.getSessionItem('accessToken');
    if (!token) {
      this.toastService.error('Please log in to view your orders');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    if (this.cachedOrders.length > 0) {
      this.filterCachedOrders();
      this.isLoading = false;
      return;
    }

    const request: GetOrdersRequestDto = {
      page: 1,
      pageSize: this.pageSize,
    };

    this.orderApiService.getOrders(request).subscribe({
      next: (response: GetOrdersResponseDto) => {
        this.cachedOrders = response.orders;
        this.allOrders = response.orders;
        this.totalCount = response.totalCount;
        this.filterCachedOrders();
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load orders');
        this.isLoading = false;
      },
    });
  }

  filterOrders(filter: string) {
    this.currentFilter = filter;
    this.currentPage = 1;
    this.filterCachedOrders();
  }

  filterCachedOrders() {
    if (this.currentFilter === 'all') {
      this.filteredOrders = [...this.cachedOrders];
    } else {
      this.filteredOrders = this.cachedOrders.filter((order) => {
        const status = order.orderStatusName?.toLowerCase();
        switch (this.currentFilter) {
          case 'delivered':
            return status === 'delivered' || status === 'completed';
          case 'shipped':
            return status === 'shipped';
          case 'processing':
            return status === 'processing';
          case 'cancelled':
            return status === 'cancelled';
          default:
            return true;
        }
      });
    }
    this.allOrders = this.filteredOrders;
  }

  // not sure if this is needed
  //-------------------------------
  trackOrder(order: OrderDto) {
    this.selectedOrder = order;
    // Show tracking modal using Bootstrap
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('trackingModal')
    );
    modal.show();
  }

  // check which one is used
  //--------------------------------
  viewOrderDetails(orderId: number) {
    this.router.navigate(['/account/orders', orderId]);

    this.router.navigate(['/user/order', orderId], {
      queryParams: { isNewOrder: false },
    });
  }

  cancelOrder(order: OrderDto): void {
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Cancel Order';
    modalRef.componentInstance.message =
      'Are you sure you want to cancel this order?';

    modalRef.result.then((result) => {
      if (result === true) {
        this.isLoading = true;

        this.orderApiService.cancelOrder(order.id).subscribe({
          next: (response) => {
            order.orderStatusName = response.orderStatusName!;
            order.orderStatusId = response.orderStatusId!;
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

  getDeliveredCount(): number {
    return this.cachedOrders.filter(
      (order) =>
        order.orderStatusName?.toLowerCase() === 'delivered' ||
        order.orderStatusName?.toLowerCase() === 'completed'
    ).length;
  }

  getShippedCount(): number {
    return this.cachedOrders.filter(
      (order) => order.orderStatusName?.toLowerCase() === 'shipped'
    ).length;
  }

  getProcessingCount(): number {
    return this.cachedOrders.filter(
      (order) => order.orderStatusName?.toLowerCase() === 'processing'
    ).length;
  }

  getCancelledCount(): number {
    return this.cachedOrders.filter(
      (order) => order.orderStatusName?.toLowerCase() === 'cancelled'
    ).length;
  }
}
