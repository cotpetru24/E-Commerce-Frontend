import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface OrderItem {
  product: {
    id: number;
    name: string;
    brandName: string;
    imagePath: string;
    price: number;
  };
  quantity: number;
  size?: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface PaymentMethod {
  method: 'card' | 'paypal';
  cardNumber?: string;
  cardholderName?: string;
  paypalEmail?: string;
}

interface ShippingInfo {
  method: string;
  estimatedDelivery: string;
}

@Component({
  selector: 'app-checkout-review',
  templateUrl: './checkout-review.component.html',
  styleUrls: ['./checkout-review.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CheckoutReviewComponent implements OnInit {
  orderItems: OrderItem[] = [];
  shippingAddress: ShippingAddress = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  };
  paymentMethod: PaymentMethod = {
    method: 'card'
  };
  shippingInfo: ShippingInfo = {
    method: 'Standard Shipping',
    estimatedDelivery: '3-5 business days'
  };
  acceptTerms: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Load order data from service or route parameters
    this.loadOrderData();
  }

  loadOrderData(): void {
    // Mock data - replace with actual service call
    this.orderItems = [
      {
        product: {
          id: 1,
          name: 'Premium Cotton T-Shirt',
          brandName: 'Fashion Brand',
          imagePath: '/assets/images/product1.jpg',
          price: 29.99
        },
        quantity: 2,
        size: 'M'
      },
      {
        product: {
          id: 2,
          name: 'Denim Jeans',
          brandName: 'Denim Co.',
          imagePath: '/assets/images/product2.jpg',
          price: 79.99
        },
        quantity: 1,
        size: '32'
      }
    ];

    this.shippingAddress = {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street',
      city: 'London',
      state: 'England',
      zipCode: 'SW1A 1AA',
      country: 'United Kingdom',
      phone: '+44 20 1234 5678'
    };

    this.paymentMethod = {
      method: 'card',
      cardNumber: '1234567890123456',
      cardholderName: 'John Doe'
    };
  }

  getItemTotal(item: OrderItem): number {
    return item.product.price * item.quantity;
  }

  getTotalItems(): number {
    return this.orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.orderItems.reduce((total, item) => total + this.getItemTotal(item), 0);
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

  editShippingAddress(): void {
    // Navigate to shipping address edit page
    this.router.navigate(['/checkout/shipping']);
  }

  editPaymentMethod(): void {
    // Navigate to payment method edit page
    this.router.navigate(['/checkout/payment']);
  }

  placeOrder(): void {
    if (!this.acceptTerms) {
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      // Navigate to order confirmation
      this.router.navigate(['/checkout/confirmation']);
    }, 2000);
  }

  goBack(): void {
    this.router.navigate(['/checkout/payment']);
  }
}
