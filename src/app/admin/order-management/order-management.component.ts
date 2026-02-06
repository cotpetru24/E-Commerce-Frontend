import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { AdminOrderApiService } from '../../services/api';
import { ToastService } from '../../services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { Utils } from '../../shared/utils';
import {
  AdminOrderDto,
  AdminOrdersStatsDto,
  GetAllOrdersRequestDto,
  UpdateOrderStatusRequestDto,
} from '@dtos';
import {
  OrdersSortByEnum,
  OrderStatusEnum,
  OrderStatusMeta,
  OrderStatusUpdateConstraints,
  PaymentStatusEnum,
  PaymentStatusMeta,
  SortDirectionEnum,
} from '@dtos/enums';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
})
export class OrderManagementComponent implements OnInit, OnDestroy {
  Math = Math;
  PaymentStatusMeta = PaymentStatusMeta;
  OrderStatusMeta = OrderStatusMeta;
  OrderStatusEnum = OrderStatusEnum;
  OrderStatusUpdateConstraints = OrderStatusUpdateConstraints;
  orders: AdminOrderDto[] = [];
  isLoading = false;
  initialInit: boolean = true;
  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalQueryCount = 0;
  searchTerm: string | null = null;
  selectedStatus: OrderStatusEnum | null = null;
  selectedDateRange = '';
  sortBy = 'date-desc';

  orderStatusOptions: OrderStatusEnum[] = [
    OrderStatusEnum.Processing,
    OrderStatusEnum.Shipped,
    OrderStatusEnum.Delivered,
    OrderStatusEnum.Cancelled,
  ];

  adminOrdersStats: AdminOrdersStatsDto = {
    totalOrdersCount: 0,
    totalDeliveredOrdersCount: 0,
    totalShippedOrdersCount: 0,
    totalProcessingOrdersCount: 0,
  };

  private subscriptions = new Subscription();

  constructor(
    private adminApiService: AdminOrderApiService,
    private router: Router,
    private toastService: ToastService,
    private modalService: NgbModal,
    public utils: Utils,
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
          1,
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
      sortBy:
        sortByField === 'total'
          ? OrdersSortByEnum.Total
          : OrdersSortByEnum.Date,
      sortDirection:
        sortDir === 'asc'
          ? SortDirectionEnum.Ascending
          : SortDirectionEnum.Descending,
    };

    this.subscriptions.add(
      this.adminApiService.getOrders(getAllOrdersRequest).subscribe({
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
      }),
    );
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadOrders();
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

  viewOrder(order: AdminOrderDto): void {
    this.router.navigate(['/admin/orders', order.id]);
  }

  updateOrderStatus(order: AdminOrderDto): void {
    const allowedNextStatuses =
      OrderStatusUpdateConstraints[order.status] ?? [];

    if (allowedNextStatuses.length === 0) {
      this.toastService.warning('This order cannot be amended.');
      return;
    }
    const modalRef = this.modalService.open(ModalDialogComponent, {
      size: 'md',
      backdrop: 'static',
    });

    modalRef.componentInstance.title = 'Update Order Status';
    modalRef.componentInstance.message = 'Select the new order status';
    modalRef.componentInstance.modalType = 'updateOrderStatus';
    modalRef.componentInstance.options = allowedNextStatuses.map((status) => ({
      label: OrderStatusEnum[status],
      value: status,
    }));

    modalRef.result.then((result: OrderStatusEnum[]) => {
      if (result && result.length > 0) {
        const selectedStatus = result[0];
        this.isLoading = true;

        const statusData: UpdateOrderStatusRequestDto = {
          statusId: selectedStatus,
          notes: 'testing the notes',
        };
        this.subscriptions.add(
          this.adminApiService
            .updateOrderStatus(order.id, statusData)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
              next: () => {
                this.toastService.success('Order status updated successfully!');
                this.loadOrders();
              },
              error: (err) => {
                if (err.status === 404) {
                  this.toastService.warning(
                    'Order not found or cannot be updated.',
                  );
                } else {
                  this.toastService.error('Failed to update order status.');
                }
              },
            }),
        );
      }
    });
  }

  markShipped(order: AdminOrderDto): void {
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Mark as shipped';
    modalRef.componentInstance.message =
      'Are you sure you want to mark this order as Shipped?';
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result: boolean) => {
      if (result === true) {
        this.isLoading = true;

        const statusData: UpdateOrderStatusRequestDto = {
          statusId: OrderStatusEnum.Shipped,
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
                'Order not found or cannot be updated.',
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

    modalRef.result.then((result: boolean) => {
      if (result === true) {
        this.isLoading = true;

        const statusData: UpdateOrderStatusRequestDto = {
          statusId: OrderStatusEnum.Cancelled,
          notes: 'Order cancelled by admin',
        };

        this.adminApiService.updateOrderStatus(order.id, statusData).subscribe({
          next: (response) => {
            const target = this.orders.find((o) => o.id === order.id);
            if (target) {
              target.status = OrderStatusEnum.Cancelled;
              target.payment.status = PaymentStatusEnum.Refunded;

              this.orders = [...this.orders];
            }

            this.toastService.success('Order cancelled successfully!');
            this.isLoading = false;
          },
          error: (err) => {
            if (err.status === 404) {
              this.toastService.warning(
                'Order not found or cannot be cancelled.',
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

  getOrderItemsCount(order: AdminOrderDto): number {
    return (
      order.orderItems.reduce(
        (orderItmsQuantity, item) => orderItmsQuantity + item.quantity,
        0,
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
