import { Component, OnInit, OnDestroy } from '@angular/core';
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
import type { PaymentIntent, StripeError } from '@stripe/stripe-js';
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripePaymentElement,
} from '@stripe/stripe-js';
import {
  OrderSummary,
  PlaceOrderRequestDto,
  OrderItemRequestDto,
  CreateAddressRequestDto,
} from '@dtos';

@Component({
  selector: 'payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class PaymentComponent implements OnInit, OnDestroy {
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private paymentElement: StripePaymentElement | null = null;
  stripeError: string | null = null;

  isLoading: boolean = false;
  isStripeInitialized: boolean = false;
  acceptTerms: boolean = false;
  billingAddressSameAsShipping: boolean = true;
  formSubmitted: boolean = false;

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
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.loadOrderSummary();

    this.initializeStripe();
  }

  async initializeStripe(): Promise<void> {
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

  loadOrderSummary(): void {
    this.orderSummary = {
      subtotal: this.cartService.getSubtotal(),
      discount: this.cartService.getDiscount(),
      shipping: this.cartService.getShippingCost(),
      total: this.cartService.getTotal(),
    };
  }

  async onSubmit(): Promise<void> {
    this.formSubmitted = true;

    if (!this.validateBillingAddress()) return;
    if (!this.validateForm()) return;
    if (!this.stripe || !this.elements) return;

    this.isLoading = true;

    const { error: submitError } = await this.elements.submit();
    if (submitError) {
      this.isLoading = false;
      this.toastService.error(
        submitError.message ?? 'Please complete payment details.',
      );
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
            next: (response) => {
              this.cartService.clearCart();
              this.router.navigate(['/user/order', response.orderId], {
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

      shippingCost: this.orderSummary.shipping,
      discount: this.orderSummary.discount,
      notes: deliveryInstructions,
      paymentIntentId: paymentIntentId,

      billingAddressSameAsShipping: this.billingAddressSameAsShipping,

      billingAddressId: this.billingAddressSameAsShipping
        ? shippingAddressId
        : null,

      billingAddressRequest: this.billingAddressSameAsShipping
        ? null
        : {
            addressLine1: this.billingAddress.addressLine1!,
            city: this.billingAddress.city!,
            postcode: this.billingAddress.postcode!,
            country: this.billingAddress.country!,
          },
    };

    return request;
  }

  onBillingAddressChange(): void {
    if (this.billingAddressSameAsShipping) {
      ((this.billingAddress.addressLine1 = ''),
        (this.billingAddress.city = ''),
        (this.billingAddress.postcode = ''),
        (this.billingAddress.country = ''));
    }
  }

  goBack(): void {
    this.router.navigate(['/checkout/shipping-address']);
  }

  validateForm(): boolean {
    if (!this.acceptTerms) {
      return false;
    }

    return true;
  }

  validateBillingAddress(): boolean {
    if (
      !this.billingAddressSameAsShipping &&
      (!this.billingAddress.addressLine1 ||
        this.billingAddress.addressLine1.trim() === '' ||
        !this.billingAddress.city ||
        this.billingAddress.city.trim() === '' ||
        !this.billingAddress.postcode ||
        this.billingAddress.postcode.trim() === '' ||
        !this.billingAddress.country ||
        this.billingAddress.country.trim() === '')
    ) {
      return false;
    }

    return true;
  }
}
