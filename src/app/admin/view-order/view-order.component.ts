import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  AdminOrderDto,
  OrderDto,
  OrderItem,
  OrderItemDto,
  PaymentMethod,
  ShippingAddress,
  ShippingAddressDto,
  ShippingInfo,
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
  imports: [CommonModule, RouterModule, FormsModule],
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
  paymentMethod: PaymentMethod = {
    method: 'card',
  };
  shippingInfo: ShippingInfo = {
    method: 'Standard Shipping',
    estimatedDelivery: '3-5 business days',
  };
  isLoading: boolean = false;
  canUpdateStatus: boolean = true;
  orderId: number | null = null;
  orderStatus: string = 'Processing';

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
        this.canUpdateStatus = 
          order.orderStatusName !== 'Cancelled' &&
          order.orderStatusName !== 'Refunded' &&
          order.orderStatusName !== 'Returned';
        this.shippingAddress = order.shippingAddress;
        this.shippingAddress.country = this.countryMap.getName(order.shippingAddress.country);

        this.billingAddress = order.billingAddress;
        this.billingAddress.country = this.countryMap.getName(order.billingAddress.country);
        
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
    return this.orderItems.reduce(
      (total, item) => total + this.getItemTotal(item),
      0
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
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Update Order Status';
    modalRef.componentInstance.message =
      'Are you sure you want to update the order status?';

    modalRef.result.then((result) => {
      if (result === true) {
        this.isLoading = true;

        // You can implement status update logic here
        // For now, we'll just show a success message
        setTimeout(() => {
          this.toastService.success('Order status updated successfully!');
          this.isLoading = false;
        }, 1000);
      }
    });
  }

  cancelOrder(): void {
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Cancel Order';
    modalRef.componentInstance.message =
      'Are you sure you want to cancel this order?';

    modalRef.result.then((result) => {
      if (result === true) {
        this.isLoading = true;

        this.adminApiService.cancelOrder(this.orderId!).subscribe({
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
    this.router.navigate(['/admin/orders']);
  }

  goToItem(productId: number): void {
    this.router.navigate(['/products/details', productId]);
  }

  goToUserProfile(): void {
    if (this.order?.userId) {
      this.router.navigate(['/admin/users'], { queryParams: { userId: this.order.userId } });
    }
  }
}
