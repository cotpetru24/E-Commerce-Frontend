import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { AuthApiService } from '../../services/auth-api.service';
import { UtilsService } from '../../services/utils.service';
import { ProductImageDto } from '../../models';

@Component({
  selector: 'app-cart-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss'],
})
export class CartViewComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  private cartSubscription: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastService: ToastService,
    private authApiService: AuthApiService,
    private utilsService: UtilsService
  ) {
    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  ngOnInit() {}

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
  }

  getItemTotal(item: CartItem): number {
    return parseFloat((item.product.price * item.quantity).toFixed(2));
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
    if (this.cartItems.length === 0) {
      this.toastService.error('Your cart is empty');
      return;
    }

    if (this.authApiService.isLoggedIn() === false) {
      this.toastService.info('Please login to proceed to checkout.');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.router.navigate(['/checkout/shipping-address']);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getPrimaryImage(images: ProductImageDto[]): string {
    let primaryImage = images?.find((img) => img.isPrimary);
    return primaryImage
      ? primaryImage.imagePath
      : 'products/image-coming-soon.png';
  }

  navigateToProductDetails(productId: number) {
    this.router.navigate(['/products/details', productId]);
  }
}
