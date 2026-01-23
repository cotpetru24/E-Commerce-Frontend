import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { OrderApiService } from '../../services/api/order-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { StorageService } from '../../services/storage.service';
import { finalize } from 'rxjs';
import {
  OrderDto,
  GetUserOrdersRequestDto,
  GetUserOrdersResponseDto,
} from '@dtos';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss',
})
export class UserOrdersComponent implements OnInit {
  isLoading = false;
  currentPage = 1;
  pageSize = 100;
  totalPages = 0;
  totalCount = 0;
  selectedOrder: OrderDto | null = null;
  orders: OrderDto[] = [];

  constructor(
    private router: Router,
    private toastService: ToastService,
    private orderApiService: OrderApiService,
    private modalService: NgbModal,
    private storageService: StorageService,
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const token = this.storageService.getSessionItem('accessToken');
    if (!token) {
      this.toastService.error('Please log in to view your orders');
      return;
    }

    this.isLoading = true;
    const request: GetUserOrdersRequestDto = {
      pageNumber: 1,
      pageSize: this.pageSize,
    };

    this.orderApiService
      .getOrders(request)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: GetUserOrdersResponseDto) => {
          this.orders = response.orders;
          this.totalCount = response.totalCount;
        },
        error: () => {
          this.toastService.error('Failed to load orders');
        },
      });
  }

  viewOrderDetails(orderId: number) {
    this.router.navigate(['/user/order', orderId], {
      queryParams: { isNewOrder: false },
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
      case 'refunded':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }
}
