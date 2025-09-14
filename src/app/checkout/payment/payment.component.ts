import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PaymentData, OrderSummary } from '../../models';
import { CartService } from '../../services/cart.service';
import {
  loadStripe,
  Stripe,
  StripeElements,
  StripePaymentElement,
} from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { PaymentApiService } from '../../services/api/payment-api.service';
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
  paymentData: PaymentData = {
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    saveCard: false,
    paypalEmail: '',
    sameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    acceptTerms: false,
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

  constructor(
    private router: Router,
    private cartService: CartService,
    private paymentApiService: PaymentApiService
  ) {}

  ngOnInit(): void {
    this.loadOrderSummary();
  }

  async ngAfterViewInit(): Promise<void> {
    // Wait for the next tick to ensure DOM is fully rendered
    setTimeout(() => {
      this.initializeStripe();
    }, 0);
  }

  public async initializeStripe(): Promise<void> {
    try {
      console.log('Initializing Stripe...');
      this.stripeError = null;
      
      const publishableKey = environment.stripePublishableKey;
      if (!publishableKey) {
        this.stripeError = 'Stripe publishable key is missing';
        console.error('Stripe publishable key is missing');
        return;
      }

      this.stripe = await loadStripe(publishableKey);
      if (!this.stripe) {
        this.stripeError = 'Stripe failed to load';
        console.error('Stripe failed to load');
        return;
      }

      console.log('Stripe loaded successfully');

      // Create payment intent
      const { clientSecret } = await firstValueFrom(
        this.paymentApiService.createPaymentIntent(
          Math.round(this.orderSummary.total * 100)
        )
      );

      if (!clientSecret) {
        this.stripeError = 'Missing clientSecret from /api/create-payment-intent response';
        console.error('Missing clientSecret from /api/create-payment-intent response');
        return;
      }

      console.log('Payment intent created, client secret received');

      // Ensure the mount point exists (it's inside *ngIf)
      const mountEl = document.querySelector('#payment-element');
      if (!mountEl) {
        this.stripeError = 'Payment element mount point not found';
        console.error('Payment element mount point not found');
        return;
      }

      console.log('Mount point found, creating Stripe Elements');

      this.elements = this.stripe.elements({ clientSecret });
      this.paymentElement = this.elements.create('payment');
      
      console.log('Payment element created, mounting...');
      this.paymentElement.mount('#payment-element');
      
      // Remove loading text after mounting
      const mountEl2 = document.querySelector('#payment-element');
      if (mountEl2) {
        const loadingEl = mountEl2.querySelector('.stripe-loading');
        if (loadingEl) {
          loadingEl.remove();
        }
      }



console.log('Mount element found:', document.querySelector('#payment-element'));
console.log('Stripe Elements object:', this.elements);
console.log('Payment Element object:', this.paymentElement);
console.log('Container dimensions:', mountEl.getBoundingClientRect());



      
      console.log('Stripe Elements mounted successfully');
      this.isStripeInitialized = true;
    } catch (e) {
      this.stripeError = `Error initializing Stripe: ${e}`;
      console.error('Error initializing Stripe:', e);
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

    if (this.paymentData.method === 'card') {
      if (!this.stripe || !this.elements) {
        this.isLoading = false;
        return;
      }
      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/order-confirmed`,
        },
      });
      // If Stripe handles a redirect, this code may not run; if it does, surface errors:
      if (error) console.error(error.message);
      this.isLoading = false;
      return;
    }

    // (Optional) handle other methods e.g. PayPal
    this.isLoading = false;
    this.router.navigate(['/checkout/checkout-review']);
  }

  validateForm(): boolean {
    if (this.paymentData.method === 'card') {
      // if (
      //   !this.paymentData.cardNumber ||
      //   !this.paymentData.expiryDate ||
      //   !this.paymentData.cvv ||
      //   !this.paymentData.cardholderName
      // ) {
      //   return false;
      // }
    } 
    else if (this.paymentData.method === 'paypal') {
      if (!this.paymentData.paypalEmail) {
        return false;
      }
    }

    if (!this.paymentData.acceptTerms) {
      return false;
    }

    if (!this.paymentData.sameAsShipping) {
      if (
        !this.paymentData.billingFirstName ||
        !this.paymentData.billingLastName ||
        !this.paymentData.billingAddress
      ) {
        return false;
      }
    }

    return true;
  }

  onBillingAddressChange(): void {
    if (this.paymentData.sameAsShipping) {
      // Clear billing address fields when same as shipping is selected
      this.paymentData.billingFirstName = '';
      this.paymentData.billingLastName = '';
      this.paymentData.billingAddress = '';
    } else {
      // Pre-fill with shipping address data (mock)
      this.paymentData.billingFirstName = 'John';
      this.paymentData.billingLastName = 'Doe';
      this.paymentData.billingAddress = '123 Main Street, London, England';
    }
  }

  onPaymentMethodChange(): void {
    // If switching to card payment, initialize Stripe Elements
    if (this.paymentData.method === 'card') {
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
    this.paymentData.cardNumber = value;
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentData.expiryDate = value;
  }
}
