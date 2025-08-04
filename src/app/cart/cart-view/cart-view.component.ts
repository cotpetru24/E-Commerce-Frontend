import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss'],
})
export class CartViewComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartSubscription: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  ngOnInit() {
    // Cart is already loaded from service
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  trackByItem(index: number, item: CartItem): string {
    return item.product.id.toString() + (item.size || '');
  }

  decreaseQuantity(item: CartItem): void {
    const newQuantity = item.quantity - 1;
    this.cartService.updateQuantity(item.product.id, item.size, newQuantity);
  }

  increaseQuantity(item: CartItem): void {
    const newQuantity = item.quantity + 1;
    this.cartService.updateQuantity(item.product.id, item.size, newQuantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id, item.size);

    // this.snackBar
    //   .open(`${item.product.name} removed from cart`, 'Undo', {
    //     duration: 3000,
    //     horizontalPosition: 'center',
    //     verticalPosition: 'bottom',
    //   })
    //   .onAction()
    //   .subscribe(() => {
    //     // Add back to cart
    //     this.cartService.addToCart(item.product, item.quantity, item.size);
    //   });
  }

  getItemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  getTotalItems(): number {
    return this.cartService.getCartItemCount();
  }

  getSubtotal(): number {
    return this.cartService.getSubtotal();
  }

  getShippingCost(): number {
    return this.cartService.getShippingCost();
  }

  getDiscount(): number {
    return this.cartService.getDiscount();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  proceedToCheckout(): void {
    // if (this.cartItems.length === 0) {
    //   this.snackBar.open('Your cart is empty', 'Close', {
    //     duration: 3000,
    //     horizontalPosition: 'center',
    //     verticalPosition: 'bottom',
    //   });
    //   return;
    // }

    console.log('Proceeding to checkout...');
    this.router.navigate(['/checkout/addressForm']);
  }

  clearCart(): void {
    this.cartService.clearCart();
    // this.snackBar.open('Cart cleared', 'Close', {
    //   duration: 2000,
    //   horizontalPosition: 'center',
    //   verticalPosition: 'bottom',
    // });
  }
}
