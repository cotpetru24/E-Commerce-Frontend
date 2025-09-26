import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderItem, PaymentMethod, ShippingAddress, ShippingInfo } from '../../models';
import { ToastService } from '../../services/toast.service';
import { OrderApiService } from '../../services/api';

@Component({
  selector: 'app-user-order',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-order.component.html',
  styleUrl: './user-order.component.scss'
})


export class UserOrderComponent implements OnInit {
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
  canCancel: boolean  = true;
  orderId: string = 'ORD123456'; 
  orderStatus: string = 'Processing'; 
  isNewOrder: boolean = true;


  constructor(
    private router: Router,
    private toastService: ToastService,
    private orderApiService: OrderApiService
  ) {}
  ngOnInit(): void {
    // Load order data from service or route parameters
    this.loadOrderData();
    this.orderConfirmed();
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

  cancelOrder(): void {


    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      // Navigate to order confirmation (you'll need to add this route)
      this.router.navigate(['/user/order/1']);
    }, 2000);
  }

  goBack(): void {
    this.router.navigate(['/user']);
  }

  goToItem(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  orderConfirmed(): void {
    if (this.isNewOrder) {
      this.toastService.success('Thank you for your order!\nYour order has been placed successfully!', 5000);
      this.isNewOrder = false; // Prevent multiple toasts
    }
}
}