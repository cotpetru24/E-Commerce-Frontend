import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { PaymentApiService } from '../../services/api/payment-api.service';
import { OrderApiService } from '../../services/api/order-api.service';
import { ToastService } from '../../services/toast.service';
import { StorageService } from '../../services/storage.service';
import { finalize, firstValueFrom, Subscription } from 'rxjs';
import { AddressData } from '../checkout.types';
import type { PaymentIntent, StripeError } from '@stripe/stripe-js';
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripePaymentElement,
} from '@stripe/stripe-js';
import {
  PaymentDto,
  OrderSummary,
  PlaceOrderRequestDto,
  OrderItemRequestDto,
  PlaceOrderResponseDto,
  CreateAddressRequestDto,
} from '@dtos';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private paymentElement: StripePaymentElement | null = null;
  private orderResponse: PlaceOrderResponseDto | null = null;

  paymentData: PaymentDto = {
    orderId: 0,
    amount: 0,
    currency: '',
    cardBrand: '',
    cardLast4: '',
    status: '',
    paymentMethod: '',
    receiptUrl:''
  };

  billingAddressData: AddressData = {
    addressLine1: '',
    city: '',
    postcode: '',
    country: '',
    instructions: '',
  };

  orderSummary: OrderSummary = {
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0,
  };

  billingAddress: CreateAddressRequestDto = {
    addressLine1: '',
    city: '',
    postcode: '',
    country: '',
  };

  isLoading: boolean = false;
  isStripeInitialized: boolean = false;
  stripeError: string | null = null;
  acceptTerms: boolean = false;
  billigngAddressSameAsShipping: boolean = true;

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private cartService: CartService,
    private paymentApiService: PaymentApiService,
    private orderApiService: OrderApiService,
    private toastService: ToastService,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.loadOrderSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async ngAfterViewInit(): Promise<void> {
    setTimeout(() => {
      this.initializeStripe();
    }, 0);
  }

  public async initializeStripe(): Promise<void> {
    try {
      this.stripeError = null;
      const publishableKey = environment.stripePublishableKey;

      if (!publishableKey) {
        this.stripeError = 'Stripe publishable key is missing';
        return;
      }

      this.stripe = await loadStripe(publishableKey);
      if (!this.stripe) {
        this.stripeError = 'Stripe failed to load';
        return;
      }

      const { clientSecret } = await firstValueFrom(
        this.paymentApiService.createPaymentIntent({
          amount: Math.round(this.orderSummary.total * 100),
        }),
      );

      if (!clientSecret) {
        this.stripeError = 'Missing clientSecret from response';
        return;
      }

      const mountEl = document.querySelector('#payment-element');
      if (!mountEl) {
        this.stripeError = 'Payment element mount point not found';
        return;
      }

      this.elements = this.stripe.elements({ clientSecret });
      // this.paymentElement = this.elements.create('payment');

      //       this.elements = this.stripe.elements({
      //   clientSecret,
      //   appearance,
      // });
      this.paymentElement = this.elements.create('payment', {
        wallets: {
          applePay: 'never',
          googlePay: 'never',
        },
      });
      this.paymentElement.mount('#payment-element');

      const mountEl2 = document.querySelector('#payment-element');
      if (mountEl2) {
        const loadingEl = mountEl2.querySelector('.stripe-loading');
        if (loadingEl) {
          loadingEl.remove();
        }
      }

      this.isStripeInitialized = true;
    } catch (e) {
      this.stripeError = `Error initializing Stripe: ${e}`;
    }
  }

  loadOrderSummary(): void {
    this.orderSummary = {
      subtotal: this.cartService.getSubtotal(),
      discount: this.cartService.getDiscount(),
      shipping: 0,
      total: this.cartService.getTotal(),
    };
  }

  async onSubmit(): Promise<void> {
    // if (!this.validateForm()) return;
    this.isLoading = true;

    if (this.paymentData.paymentMethod === 'card') {
      if (!this.stripe || !this.elements) {
        this.isLoading = false;
        return;
      }

      let paymentIntent: PaymentIntent | undefined;
      let error: StripeError | undefined;

      try {
        ({ error, paymentIntent } = await this.stripe.confirmPayment({
          elements: this.elements,
          confirmParams: {},
          redirect: 'if_required',
        }));
      } catch (e) {
        this.toastService.error('Payment failed.');
        this.isLoading = false;
        return;
      }

      if (error) {
        this.toastService.error('Payment failed: ' + error.message);
        this.isLoading = false;
        return;
      } else if (paymentIntent?.status === 'succeeded') {
        const orderRequest = this.createOrderRequest(paymentIntent.id);
        this.subscriptions.add(
          this.orderApiService
            .placeOrder(orderRequest)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
              next: (res) => {
                this.orderResponse = res;
                this.cartService.clearCart();
                this.router.navigate(['/user/order', res.orderId], {
                  queryParams: { isNewOrder: true },
                });
              },
              error: () => {
                this.toastService.error('Failed to place order.');
              },
            }),
        );
      } else {
        this.toastService.error('Payment not completed.');
        this.isLoading = false;
        return;
      }
    } else {
      this.isLoading = false;
      this.toastService.info('PayPal payments coming soon. Please pay by card.'); 
          return;
    }
  }

  private createOrderRequest(paymentIntentId: string): PlaceOrderRequestDto {
    const cartItems = this.cartService.getCartItems();
    const orderItems: OrderItemRequestDto[] = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      productSizeBarcode: item.barcode,
    }));

    const shippingAddressId = parseInt(
      this.storageService.getLocalItem('selectedShippingAddressId') || '0',
    );
    const deliveryInstructions =
      this.storageService.getLocalItem('deliveryInstructions') || '';

    const request: PlaceOrderRequestDto = {
      orderItems,
      shippingAddressId,
      billingAddressSameAsShipping: this.billigngAddressSameAsShipping,
      billingAddressId: this.billigngAddressSameAsShipping
        ? shippingAddressId
        : null,

      billingAddressRequest: this.billigngAddressSameAsShipping
        ? null
        : {
            addressLine1: this.billingAddressData.addressLine1!,
            city: this.billingAddressData.city!,
            postcode: this.billingAddressData.postcode!,
            country: this.billingAddressData.country!,
          },
      shippingCost: this.orderSummary.shipping,
      discount: this.orderSummary.discount,
      notes: deliveryInstructions,
      paymentIntentId: paymentIntentId,
    };
    return request;
  }

  validateForm(): boolean {
    if (this.paymentData.paymentMethod === 'card') {
      if (
        !this.paymentData.cardLast4 ||
        !this.paymentData.amount ||
        !this.paymentData.paymentMethod 
      ) {
        return false;
      }
    } else if (this.paymentData.paymentMethod === 'paypal') {

    }

    if (!this.acceptTerms) {
      return false;
    }

    return true;
  }

  onBillingAddressChange(): void {
    // if (this.billingAddressData.saveAddress) {
      // Clear billing address fields when same as shipping is selected
      // this.paymentData.billingName = '';
      // this.paymentData.billingLastName = '';
      // this.paymentData.billingAddress = '';
    // } else {
      // Pre-fill with shipping address data (mock)
      // this.paymentData.billingFirstName = 'John';
      // this.paymentData.billingLastName = 'Doe';
      // this.paymentData.billingAddress = '123 Main Street, London, England';
    // }
  }

  onPaymentMethodChange(): void {
    if (this.paymentData.paymentMethod === 'card') {
      if (this.paymentElement) {
        this.paymentElement.destroy();
        this.paymentElement = null;
      }
      if (this.elements) {
        this.elements = null;
      }

      setTimeout(() => {
        this.initializeStripe();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.paymentElement) {
      this.paymentElement.destroy();
      this.paymentElement = null;
    }
    if (this.elements) {
      this.elements = null;
    }
    if (this.stripe) {
      this.stripe = null;
    }
  }

  goBack(): void {
    this.router.navigate(['/checkout/address-form']);
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    this.paymentData.cardLast4 = value;
  }
}
