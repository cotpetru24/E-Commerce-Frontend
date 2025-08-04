import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface PaymentData {
  method: 'card' | 'paypal';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  saveCard: boolean;
  paypalEmail: string;
  sameAsShipping: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  acceptTerms: boolean;
}

interface OrderSummary {
  subtotal: number;
  shipping: number;
  total: number;
}

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PaymentMethodComponent implements OnInit {
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
    acceptTerms: false
  };

  orderSummary: OrderSummary = {
    subtotal: 0,
    shipping: 0,
    total: 0
  };

  isLoading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadOrderSummary();
  }

  loadOrderSummary(): void {
    // Mock data - replace with actual service call
    this.orderSummary = {
      subtotal: 129.98,
      shipping: 0, // Free shipping
      total: 129.98
    };
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    // Simulate payment processing
    setTimeout(() => {
      this.isLoading = false;
      // Navigate to review page
      this.router.navigate(['/checkout/review']);
    }, 2000);
  }

  validateForm(): boolean {
    if (this.paymentData.method === 'card') {
      if (!this.paymentData.cardNumber || !this.paymentData.expiryDate || 
          !this.paymentData.cvv || !this.paymentData.cardholderName) {
        return false;
      }
    } else if (this.paymentData.method === 'paypal') {
      if (!this.paymentData.paypalEmail) {
        return false;
      }
    }

    if (!this.paymentData.acceptTerms) {
      return false;
    }

    if (!this.paymentData.sameAsShipping) {
      if (!this.paymentData.billingFirstName || !this.paymentData.billingLastName || 
          !this.paymentData.billingAddress) {
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

  goBack(): void {
    this.router.navigate(['/checkout/shipping']);
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
