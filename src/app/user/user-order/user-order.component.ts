import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  OrderDto,
  OrderItem,
  OrderItemDto,
  PaymentMethod,
  ShippingAddress,
  ShippingAddressDto,
  ShippingInfo,
} from '../../models';
import { ToastService } from '../../services/toast.service';
import { OrderApiService } from '../../services/api';
import { ActivatedRoute } from '@angular/router';
import { number } from 'zod';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { switchMap } from 'rxjs';
import { CountryMapService } from '../../services/country-map.service';

@Component({
  selector: 'app-user-order',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-order.component.html',
  styleUrl: './user-order.component.scss',
})
export class UserOrderComponent implements OnInit {
  order: OrderDto | null = null;
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
  acceptTerms: boolean = false;
  isLoading: boolean = false;
  canCancel: boolean = true;
  orderId: number | null = null;
  orderStatus: string = 'Processing';
  isNewOrder: boolean = false;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private orderApiService: OrderApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private countryMap: CountryMapService
  ) {}
  ngOnInit(): void {
    // Load order data from service or route parameters
    const isNewOrderParam = this.route.snapshot.queryParamMap.get('isNewOrder');
    this.isNewOrder = isNewOrderParam === 'true';
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadOrderData();
    this.orderConfirmed();
  }

  loadOrderData(): void {
    // Mock data - replace with actual service call

    this.orderApiService.getOrder(this.orderId!).subscribe({
      next: (order) => {
        this.order = order;
        this.orderItems = order.orderItems;
        this.orderStatus = order.orderStatusName!;
        this.canCancel =
          order.orderStatusName !== 'Cancelled' &&
          order.orderStatusName !== 'Refunded' &&
          order.orderStatusName !== 'Returned';
        this.shippingAddress = order.shippingAddress;
        this.shippingAddress.country = this.shippingAddress.country =
          this.countryMap.getName(this.order.shippingAddress.country);

        this.billingAddress = order.billingAddress;
        this.billingAddress.country = this.billingAddress.country =
          this.countryMap.getName(this.order.billingAddress.country);
      },
      error: (err) => {
        console.error('Error loading order or shipping address:', err);
        this.toastService.error('Failed to load order details');
      },
    });

    // this.shippingAddress = {
    //   firstName: 'John',
    //   lastName: 'Doe',
    //   address: '123 Main Street',
    //   city: 'London',
    //   state: 'England',
    //   zipCode: 'SW1A 1AA',
    //   country: 'United Kingdom',
    //   phone: '+44 20 1234 5678',
    // };

    this.paymentMethod = {
      method: 'card',
      cardNumber: '1234567890123456',
      cardholderName: 'John Doe',
    };
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

  cancelOrder(): void {
    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Cancel Order';
    modalRef.componentInstance.message =
      'Are you sure you want to cancel this order?';

    modalRef.result.then((result) => {
      if (result === true) {
        this.isLoading = true;

        this.orderApiService.cancelOrder(this.orderId!).subscribe({
          next: (response) => {
            this.orderStatus = response.orderStatusName!; // comes from OrderDto
            this.canCancel = false;
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
    this.router.navigate(['/user']);
  }

  goToItem(productId: number): void {
    this.router.navigate(['/products/details', productId]);
  }

  orderConfirmed(): void {
    if (this.isNewOrder) {
      this.toastService.success(
        'Thank you for your order!\nYour order has been placed successfully!',
        5000
      );
      this.isNewOrder = false; // Prevent multiple toasts
    }
  }

  navMyOrders(): void {
    this.router.navigate(['/user/orders']);
  }
}
