import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss']
})
export class CartSummaryComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    // Mock data - replace with actual service call
    this.cartItems = [
      {
        id: 1,
        name: 'Premium Cotton T-Shirt',
        price: 29.99,
        quantity: 2,
        image: '/assets/images/product1.jpg'
      },
      {
        id: 2,
        name: 'Denim Jeans',
        price: 79.99,
        quantity: 1,
        image: '/assets/images/product2.jpg'
      }
    ];
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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

  proceedToCheckout(): void {
    this.router.navigate(['/checkout/addressForm']);
  }
}
