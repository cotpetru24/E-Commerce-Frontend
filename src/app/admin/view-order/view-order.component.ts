import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ShippingInfo } from '../../checkout/checkout.types';
import { ToastService } from '../../services/toast.service';
import { AdminOrderApiService } from 'app/services/api';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { CountryMapService } from '../../services/country-map.service';
import { Utils } from '../../shared/utils';
import {
  AdminOrderDto,
  OrderDto,
  OrderItemDto,
  OrderStatus,
  AddressDto,
  UpdateOrderStatusRequestDto,
} from '@dtos';

@Component({
  selector: 'app-view-order',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ModalDialogComponent],
  templateUrl: './view-order.component.html',
  styleUrl: './view-order.component.scss',
})
export class ViewOrderComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  canUpdateStatus: boolean = true;
  orderId: number | null = null;
  orderStatus: string = 'Processing';
  cameFromDashboard: boolean = false;
  cameFromUserProfile: boolean = false;
  order: AdminOrderDto | null = null;
  orderItems: OrderItemDto[] = [];
  shippingAddress: AddressDto | null = null;
  billingAddress: AddressDto | null = null;

  shippingInfo: ShippingInfo = {
    method: 'Standard Shipping',
    estimatedDelivery: '3-5 business days',
  };

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private toastService: ToastService,
    private adminApiOrderService: AdminOrderApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private countryMap: CountryMapService,
    private utils: Utils
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.subscriptions.add(
      this.route.queryParams.subscribe((params) => {
        this.cameFromDashboard = params['from'] === 'dashboard';
        this.cameFromUserProfile = params['from'] === 'user-profile';
      })
    );

    this.utils.scrollToTop();

    if (this.orderId) {
      this.loadOrderData();
    } else {
      this.toastService.error('Invalid order ID');
      this.router.navigate(['/admin/orders']);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadOrderData(): void {
    this.isLoading = true;

    this.subscriptions.add(
      this.adminApiOrderService
        .getOrderById(this.orderId!)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (order) => {
            this.order = order;
            this.orderItems = order.orderItems;
            this.orderStatus = order.orderStatusName!;
            this.canUpdateStatus = true;
            this.shippingAddress = order.shippingAddress ?? null;
            if (this.shippingAddress) {
              this.shippingAddress.country = this.countryMap.getName(
                this.shippingAddress.country
              );
            }

            this.billingAddress = order.billingAddress ?? null;
            if (this.billingAddress) {
              this.billingAddress.country = this.countryMap.getName(
                this.billingAddress.country
              );
            } else if (this.shippingAddress) {
              this.billingAddress = {
                id: this.shippingAddress.id,
                addressLine1: this.shippingAddress.addressLine1,
                city: this.shippingAddress.city,
                county: this.shippingAddress.county,
                postcode: this.shippingAddress.postcode,
                country: this.shippingAddress.country,
              };
            }
          },
          error: () => {
            this.toastService.error('Failed to load order details');
            this.router.navigate(['/admin/orders']);
          },
        })
    );
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

        this.subscriptions.add(
          this.adminApiOrderService
            .updateOrderStatus(this.orderId!, statusData)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
              next: () => {
                this.orderStatus = OrderStatus[selectedStatus];
                this.canUpdateStatus = true;
                this.toastService.success('Order status updated successfully!');
              },
              error: (err) => {
                if (err.status === 404) {
                  this.toastService.warning(
                    'Order not found or cannot be updated.'
                  );
                } else {
                  this.toastService.error('Failed to update order status.');
                }
              },
            })
        );
      }
    });
  }

  cancelOrder(): void {
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Cancel Order';
    modalRef.componentInstance.message =
      'Are you sure you want to cancel this order?';
    modalRef.componentInstance.modalType = 'confirm';

    modalRef.result.then((result: boolean) => {
      if (result === true) {
        this.isLoading = true;

        const statusData: UpdateOrderStatusRequestDto = {
          orderStatusId: OrderStatus.cancelled,
          notes: 'Order cancelled by admin',
        };

        this.subscriptions.add(
          this.adminApiOrderService
            .updateOrderStatus(this.orderId!, statusData)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
              next: () => {
                this.orderStatus = 'Cancelled';
                this.canUpdateStatus = false;
                this.toastService.success('Order cancelled successfully!');
              },
              error: (err) => {
                if (err.status === 404) {
                  this.toastService.warning(
                    'Order not found or cannot be cancelled.'
                  );
                } else {
                  this.toastService.error('Failed to cancel order.');
                }
              },
            })
        );
      }
    });
  }

  goBack(): void {
    if (this.cameFromDashboard) {
      this.router.navigate(['/admin']);
    } else if (this.cameFromUserProfile) {
      this.router.navigate(['/admin/users', this.order?.userId]);
    } else {
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
