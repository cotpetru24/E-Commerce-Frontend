import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  PaymentDto,
  OrderSummary,
  PlaceOrderRequestDto,
  OrderItemRequestDto,
  PlaceOrderResponseDto,
  CreateBillingAddressRequestDto,
  AddressData,
} from '../../models';
import { CartService } from '../../services/cart.service';
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripePaymentElement,
} from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { PaymentApiService } from '../../services/api/payment-api.service';
import { OrderApiService } from '../../services/api/order-api.service';
import { ToastService } from '../../services/toast.service';
import { StorageService } from '../../services/storage.service';
import { firstValueFrom } from 'rxjs';

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
  currency: "",
  cardBrand: "",
  cardLast4: "",
  billingName: "",
  billingEmail: "",
  status: "",
  paymentMethod: ""
  };

  billingAddressData: AddressData = {
    addressLine1: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    instructions: '',
    saveAddress: false,
  };

  orderSummary: OrderSummary = {
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0,
  };

  isLoading: boolean = false;
  isStripeInitialized: boolean = false;
  stripeError: string | null = null;
  acceptTerms: boolean = false;
  billingAddress: CreateBillingAddressRequestDto = {
    addressLine1: '',
    city: '',
    county: '',
    postcode: '',
    country: '',
  };
  //
  billigngAddressSameAsShipping: boolean = true;

  constructor(
    private router: Router,
    private cartService: CartService,
    private paymentApiService: PaymentApiService,
    private orderApiService: OrderApiService,
    private toastService: ToastService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadOrderSummary();
        window.scrollTo({ top: 0, behavior: 'smooth' });

  }

  async ngAfterViewInit(): Promise<void> {
    // Wait for the next tick to ensure DOM is fully rendered
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

      // Create payment intent
      const { clientSecret } = await firstValueFrom(
        this.paymentApiService.createPaymentIntent(
          Math.round(this.orderSummary.total * 100)
        )
      );

      if (!clientSecret) {
        this.stripeError = 'Missing clientSecret from /api/create-payment-intent response';
        return;
      }

      const mountEl = document.querySelector('#payment-element');
      if (!mountEl) {
        this.stripeError = 'Payment element mount point not found';
        return;
      }

      this.elements = this.stripe.elements({ clientSecret });
      this.paymentElement = this.elements.create('payment');
      this.paymentElement.mount('#payment-element');

      // Remove loading text after mounting
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
    // Mock data - replace with actual service call
    this.orderSummary = {
      subtotal: this.cartService.getSubtotal(),
      discount: this.cartService.getDiscount(),
      shipping: 0, // Free shipping
      total: this.cartService.getTotal(),
    };
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) return;
    this.isLoading = true;

    try {
      // First, place the order
      const orderRequest = this.createOrderRequest();
      this.orderResponse = await firstValueFrom(
        this.orderApiService.placeOrder(orderRequest)
      );

      this.toastService.success('Order placed successfully!');

      // Store order ID for confirmation page
      this.storageService.setLocalItem(
        'lastOrderId',
        this.orderResponse.orderId.toString()
      );

      if (this.paymentData.paymentMethod === 'card') {
        if (!this.stripe || !this.elements) {
          this.isLoading = false;
          return;
        }

        // Process payment with Stripe
        const { error, paymentIntent } = await this.stripe.confirmPayment({
          elements: this.elements,
          confirmParams: {},
          redirect: 'if_required',
        });

        if (paymentIntent && paymentIntent.status === 'succeeded' && !error) {
          this.paymentApiService
            .storePaymentDetails(this.orderResponse.orderId, paymentIntent.id)
            .subscribe({
              next: () => {
                this.cartService.clearCart();
                this.isLoading = false;
                this.router.navigate(
                  ['/user/order', this.orderResponse!.orderId],
                  {
                    queryParams: { isNewOrder: true },
                  }
                );
              },
            });
        } else if (error) {
          {
            this.toastService.error('Payment failed: ' + error.message);
            this.isLoading = false;
            return;
          }
        }
      } else {
        // For non-card payments, redirect to confirmation
        this.router.navigate(['/user/order', this.orderResponse.orderId], {
          queryParams: { isNewOrder: true },
        });
      }
    } catch {
      this.toastService.error('Failed to place order. Please try again.');
      this.isLoading = false;
    }
  }

  private createOrderRequest(): PlaceOrderRequestDto {
    const cartItems = this.cartService.getCartItems();
    const orderItems: OrderItemRequestDto[] = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      ...(item.size && { size: item.size }), // Only include size if it's defined
    }));

    const shippingAddressId = parseInt(
      this.storageService.getLocalItem('selectedShippingAddressId') || '0'
    );
    const deliveryInstructions =
      this.storageService.getLocalItem('deliveryInstructions') || '';

    return {
      orderItems,
      shippingAddressId,
      billingAddressSameAsShipping: this.billigngAddressSameAsShipping,
      billingAddress: !this.billingAddressData.saveAddress
        ? null
        : {
            addressLine1: this.billingAddressData.addressLine1!,
            city: this.billingAddressData.city!,
            county: this.billingAddressData.state!,
            postcode: this.billingAddressData.postcode!,
            country: this.billingAddressData.country!,
          },
      shippingCost: this.orderSummary.shipping,
      discount: this.orderSummary.discount,
      notes: deliveryInstructions,
    };
  }

  validateForm(): boolean {
    if (this.paymentData.paymentMethod === 'card') {
      // if (
      //   !this.paymentData.cardNumber ||
      //   !this.paymentData.expiryDate ||
      //   !this.paymentData.cvv ||
      //   !this.paymentData.cardholderName
      // ) {
      //   return false;
      // }
    } else if (this.paymentData.paymentMethod === 'paypal') {
      if (!this.paymentData.billingEmail) {
        return false;
      }
    }

    if (!this.acceptTerms) {
      return false;
    }

    if (!this.billingAddressData.saveAddress) {
      // if (
      //   !this.paymentData.billingName 
      //   // || !this.paymentData.billingLastName ||
      //   // !this.paymentData.billingAddress
      // ) {
      //   return false;
      // }
    }

    return true;
  }

  onBillingAddressChange(): void {
    if (this.billingAddressData.saveAddress) {
      // Clear billing address fields when same as shipping is selected
      this.paymentData.billingName = '';
      // this.paymentData.billingLastName = '';
      // this.paymentData.billingAddress = '';
    } else {
      // Pre-fill with shipping address data (mock)
      // this.paymentData.billingFirstName = 'John';
      // this.paymentData.billingLastName = 'Doe';
      // this.paymentData.billingAddress = '123 Main Street, London, England';
    }
  }

  onPaymentMethodChange(): void {
    // If switching to card payment, initialize Stripe Elements
    if (this.paymentData.paymentMethod === 'card') {
      // Clear any existing elements
      if (this.paymentElement) {
        this.paymentElement.destroy();
        this.paymentElement = null;
      }
      if (this.elements) {
        this.elements = null;
      }

      // Re-initialize Stripe Elements
      setTimeout(() => {
        this.initializeStripe();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    // Clean up Stripe Elements when component is destroyed
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

  // formatExpiryDate(event: any): void {
  //   let value = event.target.value.replace(/\D/g, '');
  //   if (value.length >= 2) {
  //     value = value.substring(0, 2) + '/' + value.substring(2, 4);
  //   }
  //   this.paymentData = value;
  // }
}
