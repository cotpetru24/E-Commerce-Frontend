import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductDto } from '../models/product.dto';

export interface CartItem {
  product: ProductDto;
  quantity: number;
  size?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    // Load cart from localStorage on service initialization
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const cartItems = JSON.parse(storedCart);
        this.cartItemsSubject.next(cartItems);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        this.cartItemsSubject.next([]);
      }
    }
  }

  private saveCartToStorage(cartItems: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  addToCart(product: ProductDto, quantity: number = 1, size?: string): void {
    const currentCart = this.cartItemsSubject.value;
    const itemKey = size ? `${product.id}-${size}` : product.id;
    
    // Check if item already exists in cart
    const existingItemIndex = currentCart.findIndex(item => {
      const itemKeyToCheck = item.size ? `${item.product.id}-${item.size}` : item.product.id;
      return itemKeyToCheck === itemKey;
    });

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += quantity;
      
      // Ensure quantity doesn't exceed stock
      if (updatedCart[existingItemIndex].quantity > product.stock) {
        updatedCart[existingItemIndex].quantity = product.stock;
      }
      
      this.cartItemsSubject.next(updatedCart);
      this.saveCartToStorage(updatedCart);
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        product,
        quantity: Math.min(quantity, product.stock),
        size
      };
      
      const updatedCart = [...currentCart, newItem];
      this.cartItemsSubject.next(updatedCart);
      this.saveCartToStorage(updatedCart);
    }
  }

  updateQuantity(productId: number, size: string | undefined, quantity: number): void {
    const currentCart = this.cartItemsSubject.value;
    const itemKey = size ? `${productId}-${size}` : productId;
    
    const existingItemIndex = currentCart.findIndex(item => {
      const itemKeyToCheck = item.size ? `${item.product.id}-${item.size}` : item.product.id;
      return itemKeyToCheck === itemKey;
    });

    if (existingItemIndex !== -1) {
      const updatedCart = [...currentCart];
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        updatedCart.splice(existingItemIndex, 1);
      } else {
        // Update quantity
        updatedCart[existingItemIndex].quantity = Math.min(quantity, updatedCart[existingItemIndex].product.stock);
      }
      
      this.cartItemsSubject.next(updatedCart);
      this.saveCartToStorage(updatedCart);
    }
  }

  removeFromCart(productId: number, size?: string): void {
    const currentCart = this.cartItemsSubject.value;
    const itemKey = size ? `${productId}-${size}` : productId;
    
    const updatedCart = currentCart.filter(item => {
      const itemKeyToCheck = item.size ? `${item.product.id}-${item.size}` : item.product.id;
      return itemKeyToCheck !== itemKey;
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
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  getShippingCost(): number {
    const subtotal = this.getSubtotal();
    return subtotal >= 50 ? 0 : 5.99;
  }

  getDiscount(): number {
    const subtotal = this.getSubtotal();
    if (subtotal >= 100) {
      return subtotal * 0.1; // 10% discount for orders over £100
    }
    return 0;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() - this.getDiscount();
  }

  isInCart(productId: number, size?: string): boolean {
    const itemKey = size ? `${productId}-${size}` : productId;
    return this.cartItemsSubject.value.some(item => {
      const itemKeyToCheck = item.size ? `${item.product.id}-${item.size}` : item.product.id;
      return itemKeyToCheck === itemKey;
    });
  }

  getItemQuantity(productId: number, size?: string): number {
    const itemKey = size ? `${productId}-${size}` : productId;
    const item = this.cartItemsSubject.value.find(item => {
      const itemKeyToCheck = item.size ? `${item.product.id}-${item.size}` : item.product.id;
      return itemKeyToCheck === itemKey;
    });
    return item ? item.quantity : 0;
  }
} 