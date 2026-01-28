import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { OrderApiService } from '../../services/api';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDialogComponent } from '../../shared/modal-dialog.component/modal-dialog.component';
import { finalize, switchMap } from 'rxjs';
import { CountryMapService } from '../../services/country-map.service';
import { ShippingInfo } from 'app/checkout/checkout.types';
import { AddressDto, OrderDto, OrderItemDto, PaymentDto } from '@dtos';
import { Utils } from 'app/shared/utils';
import { StorageService } from 'app/services/storage.service';

@Component({
  selector: 'app-user-order',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-order.component.html',
  styleUrl: './user-order.component.scss',
})
export class UserOrderComponent implements OnInit {
  order: OrderDto = this.createEmptyOrder()
  // orderItems: OrderItemDto[] = [];
  // shippingAddress: AddressDto = {
  //   id: 0,
  //   userId: '',
  //   addressLine1: '',
  //   city: '',
  //   county: '',
  //   postcode: '',
  //   country: '',
  // };

  // billingAddress: AddressDto = {
  //   id: 0,
  //   userId: '',
  //   addressLine1: '',
  //   city: '',
  //   county: '',
  //   postcode: '',
  //   country: '',
  // };

  shippingInfo: ShippingInfo = {
    method: 'Standard Shipping',
    estimatedDelivery: '3-5 business days',
  };
  acceptTerms: boolean = false;
  isLoading: boolean = false;
  canCancel: boolean = true;
  // orderId: number | null = null;
  // orderStatus: string = 'Processing';
  isNewOrder: boolean = false;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private orderApiService: OrderApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private countryMap: CountryMapService,
      private utils: Utils,
      private storageService : StorageService


  ) {}
  ngOnInit(): void {
    // Load order data from service or route parameters
    const isNewOrderParam = this.route.snapshot.queryParamMap.get('isNewOrder');
    this.isNewOrder = isNewOrderParam === 'true';
    this.order.id = Number(this.route.snapshot.paramMap.get('id'));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.loadOrderData();
    this.orderConfirmed();
  }

  loadOrderData(): void {
        const token = this.storageService.getSessionItem('accessToken');
    if (!token) {
      this.toastService.error('Please log in to view your orders');
      return;
    }

    this.isLoading = true;

    this.orderApiService
    .getOrder(this.order.id)
    .pipe(finalize(()=> (this.isLoading = false)))
    .subscribe({
      next: (order) => {
        this.order = order;

        //not sure if the below is needed, to test input a couple of orders
        //-----------------------------------------
        // this.orderItems = order.orderItems;
        // this.orderStatus = order.orderStatusName!;
        this.canCancel = this.canCancelOrder(order.orderStatusName ?? '');
        // this.shippingAddress = order.shippingAddress;
        this.order.shippingAddress.country = this.order.shippingAddress.country =
          this.countryMap.getName(this.order.shippingAddress.country);

        // this.billingAddress = order.billingAddress;
        this.order.billingAddress.country = this.order.billingAddress.country =
          this.countryMap.getName(this.order!.billingAddress.country);
      },
      error: () => {
        this.toastService.error('Failed to load order details');
      },
    });
  }


  //   loadOrderData(): void {
  //       const token = this.storageService.getSessionItem('accessToken');
  //   if (!token) {
  //     this.toastService.error('Please log in to view your orders');
  //     return;
  //   }

  //   this.isLoading = true;

  //   this.orderApiService.getOrder(this.orderId!).subscribe({
  //     next: (order) => {
  //       this.order = order;
  //       this.orderItems = order.orderItems;
  //       this.orderStatus = order.orderStatusName!;
  //       this.canCancel = this.canCancelOrder(order.orderStatusName ?? '');
  //       this.shippingAddress = order.shippingAddress;
  //       this.shippingAddress.country = this.shippingAddress.country =
  //         this.countryMap.getName(this.order!.shippingAddress.country);

  //       this.billingAddress = order.billingAddress;
  //       this.billingAddress.country = this.billingAddress.country =
  //         this.countryMap.getName(this.order!.billingAddress.country);
  //     },
  //     error: () => {
  //       this.toastService.error('Failed to load order details');
  //     },
  //   });
  // }























  orderConfirmed(): void {
    if (this.isNewOrder) {
      this.toastService.success(
        'Thank you for your order!\nYour order has been placed successfully!',
        5000,
      );
      this.isNewOrder = false; // Prevent multiple toasts
    }
  }



  //-- check what is called for new orders, this or goBack !!!!!!
  navMyOrders(): void {
    this.router.navigate(['/user/orders']);
  }





//----- Cleaned and tested
  cancelOrder(): void {
  if (!this.order) {
    this.toastService.error('Order not loaded.');
    return;
  }
  const orderId = this.order.id;

    const modalRef = this.modalService.open(ModalDialogComponent);
    modalRef.componentInstance.title = 'Cancel Order';
    modalRef.componentInstance.message =
      'Are you sure you want to cancel this order?';

    modalRef.result.then((result: boolean) => {
      if (result === true) {
        this.isLoading = true;

        this.orderApiService
          .cancelOrder(orderId)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: (response: OrderDto) => {              
              this.order.orderStatusName = response.orderStatusName!;
              this.canCancel = this.canCancelOrder(this.order.orderStatusName);
              this.order && (this.order.orderStatusId = response.orderStatusId!);
              this.order && (this.order.orderStatusName = response.orderStatusName!);
              this.toastService.success('Order cancelled successfully!');
            },
            error: (err) => {
              if (err.status === 404) {
                this.toastService.warning(
                  'Order not found or cannot be cancelled.',
                );
              } else {
                this.toastService.error('Failed to cancel order.');
              }
            },
          });
      }
    });
  }

canCancelOrder(status: string): boolean {
  return status === 'Processing';
}

  getItemTotal(item: OrderItemDto): number {
    return item.productPrice * item.quantity;
  }

  getTotalItems(): number {
    return this.order.orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.order?.subtotal ??
    (this.order.orderItems.reduce(
      (total, item) => total + this.getItemTotal(item),
      0,
    ));
  }

  getShippingCost(): number {
    // free shipping for orders over £50
    return this.order?.shippingCost ??
    (this.getSubtotal() >= 50 ? 0 : 5.99);
  }

  getDiscount(): number {
    // 10% discount for orders over £100
    return this.order?.discount ??  
    (this.getSubtotal() >= 100 ? this.getSubtotal() * 0.1 : 0);
  }





getTotal(): number {
  return this.order?.total ??
    (this.getSubtotal() + this.getShippingCost() - this.getDiscount());
}

    goBack(): void {
    this.router.navigate(['/user/orders']);
  }

  goToItem(productId: number): void {
    this.utils.scrollToTop();
    this.router.navigate(['/products/details', productId]);
  }

private createEmptyOrder(): OrderDto {
  return {
    id: 0,
    subtotal: 0,
    shippingCost: 0,
    discount: 0,
    total: 0,
    shippingAddress: {} as AddressDto,
    billingAddress: {} as AddressDto,
    orderItems: [],
    payment:{} as PaymentDto
  };
}
}
