import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  AdminOrderDto,
  OrderDto,
  OrderItem,
  OrderItemDto,
  OrderStatus,
  PaymentMethod,
  ShippingAddress,
  ShippingAddressDto,
  ShippingInfo,
  UpdateOrderStatusRequestDto,
} from '../../models';
import { ToastService } from '../../services/toast.service';
import { AdminApiService } from '../../services/api/admin-api.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { CountryMapService } from '../../services/country-map.service';

@Component({
  selector: 'app-view-order',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ModalDialogComponent],
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.scss',
})
export class ViewOrderComponent implements OnInit {
  order: AdminOrderDto | null = null;
  orderItems: OrderItemDto[] = [];
  shippingAddress: ShippingAddressDto = {
    addressLine1: '',
    city: '',
    county: '',
    postcode: '',
    country: '',
    id: 0,
    userId: '',
  };

  billingAddress: ShippingAddressDto = {
    addressLine1: '',
    city: '',
    county: '',
    postcode: '',
    country: '',
    id: 0,
    userId: '',
  };

  shippingInfo: ShippingInfo = {
    method: 'Standard Shipping',
    estimatedDelivery: '3-5 business days',
  };
  isLoading: boolean = false;
  canUpdateStatus: boolean = true;
  orderId: number | null = null;
  orderStatus: string = 'Processing';
  cameFromDashboard: boolean = false;
  cameFromUserProfile: boolean = false;


  constructor(
    private router: Router,
    private toastService: ToastService,
    private adminApiService: AdminApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private countryMap: CountryMapService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));

    // Check if we came from dashboard
    this.route.queryParams.subscribe((params) => {
      this.cameFromDashboard = params['from'] === 'dashboard';
      this.cameFromUserProfile = params['from'] === 'user-profile';

    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (this.orderId) {
      this.loadOrderData();
    } else {
      this.toastService.error('Invalid order ID');
      this.router.navigate(['/admin/orders']);
    }
  }

  loadOrderData(): void {
    this.isLoading = true;

    this.adminApiService.getOrder(this.orderId!).subscribe({
      next: (order) => {
        this.order = order;
        this.orderItems = order.orderItems;
        this.orderStatus = order.orderStatusName!;
        this.canUpdateStatus = true;
          // order.orderStatusName !== 'Cancelled' &&
          // order.orderStatusName !== 'Refunded' &&
          // order.orderStatusName !== 'Returned';
        this.shippingAddress = order.shippingAddress;
        this.shippingAddress.country = this.countryMap.getName(
          order.shippingAddress.country
        );

        this.billingAddress = order.billingAddress ?? this.shippingAddress;
        this.billingAddress.country = this.countryMap.getName(
          order.billingAddress?.country?? order.shippingAddress.country
        );

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading order:', err);
        this.toastService.error('Failed to load order details');
        this.isLoading = false;
        this.router.navigate(['/admin/orders']);
      },
    });
  }

  getItemTotal(item: OrderItemDto): number {
    return item.productPrice * item.quantity;
  }

  getTotalItems(): number {
    return this.orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return (
      this.order?.orderItems?.reduce(
        (total, item) => total + this.getItemTotal(item),
        0
      ) ?? 0
    );
  }

  getShippingCost(): number {
    // Free shipping for orders over £50
    return this.getSubtotal() >= 50 ? 0 : 5.99;
  }

  getDiscount(): number {
    // 10% discount for orders over £100
    return this.getSubtotal() >= 100 ? this.getSubtotal() * 0.1 : 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() - this.getDiscount();
  }

  updateOrderStatus(): void {
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
      // { label: 'Cancelled', value: OrderStatus.cancelled },
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
          .updateOrderStatus(this.orderId!, statusData)
          .subscribe({
            next: () => {
              this.orderStatus = OrderStatus[selectedStatus];
              this.canUpdateStatus = true;
              this.toastService.success('Order status updated successfully!');
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

  cancelOrder(): void {
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

        this.adminApiService
          .updateOrderStatus(this.orderId!, statusData)
          .subscribe({
            next: (response) => {
              this.orderStatus = 'Cancelled';
              this.canUpdateStatus = false;
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

  goBack(): void {
    if (this.cameFromDashboard) {
      this.router.navigate(['/admin']);
    } 
    else if (this.cameFromUserProfile){
      this .router.navigate(['/admin/users', this.order?.userId]);
    }
    else {
      this.router.navigate(['/admin/orders']);
    }
  }

  goToItem(productId: number): void {
    this.router.navigate(['/products/details', productId]);
  }

  goToUserProfile(): void {
    if (this.order?.userId) {
    this.router.navigate(['/admin/users', this.order.userId]);

    }
  }
}
