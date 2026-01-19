import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductDto } from '@dtos';
import { CartItem } from '..//cart/cart.types';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const cartItems = this.storageService.getLocalObject<CartItem[]>('cart');
    this.cartItemsSubject.next(cartItems ?? []);
  }

  private saveCartToStorage(cartItems: CartItem[]): void {
    this.storageService.setLocalObject<CartItem[]>('cart', cartItems);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }

  addToCart(
    product: ProductDto,
    quantity: number = 1,
    size: number,
    barcode: string,
  ): void {
    const currentCart = this.cartItemsSubject.value;
    const existingItemIndex = currentCart.findIndex((item) => {
      return item.barcode === barcode;
    });

    if (existingItemIndex !== -1) {
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += quantity;

      if (updatedCart[existingItemIndex].quantity > product.totalStock) {
        updatedCart[existingItemIndex].quantity = product.totalStock;
      }

      this.cartItemsSubject.next(updatedCart);
      this.saveCartToStorage(updatedCart);
    } else {
      const newItem: CartItem = {
        product,
        quantity: Math.min(quantity, product.totalStock),
        size,
        barcode,
      };

      const updatedCart = [...currentCart, newItem];
      this.cartItemsSubject.next(updatedCart);
      this.saveCartToStorage(updatedCart);
    }
  }

  updateQuantity(barcode: string, quantity: number): void {
    const currentCart = this.cartItemsSubject.value;
    const existingItemIndex = currentCart.findIndex((item) => {
      return item.barcode === barcode;
    });

    if (existingItemIndex !== -1) {
      const updatedCart = [...currentCart];

      if (quantity <= 0) {
        updatedCart.splice(existingItemIndex, 1);
      } else {
        updatedCart[existingItemIndex].quantity = Math.min(
          quantity,
          updatedCart[existingItemIndex].product.totalStock,
        );
      }

      this.cartItemsSubject.next(updatedCart);
      this.saveCartToStorage(updatedCart);
    }
  }

  removeFromCart(barcode: string): void {
    const currentCart = this.cartItemsSubject.value;
    const updatedCart = currentCart.filter((item) => {
      return item.barcode !== barcode;
    });

    this.cartItemsSubject.next(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage([]);
  }

  getSubtotal(): number {
    return this.cartItemsSubject.value.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  getShippingCost(): number {
    const subtotal = this.getSubtotal();
    return subtotal >= 50 ? 0 : 5.99;
  }

  getDiscount(): number {
    const subtotal = this.getSubtotal();
    if (subtotal >= 100) {
      return subtotal * 0.1;
    }
    return 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() - this.getDiscount();
  }

  isInCart(barcode: string): boolean {
    return this.cartItemsSubject.value.some((item) => {
      return item.barcode === barcode;
    });
  }

  getItemQuantity(barcode: string): number {
    const item = this.cartItemsSubject.value.find((item) => {
      return item.barcode === barcode;
    });
    return item ? item.quantity : 0;
  }
}
