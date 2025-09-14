import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AddressData, OrderSummary } from '../../models';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ShippingAddressComponent implements OnInit {
  addressData: AddressData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    instructions: '',
    saveAddress: false
  };
  
  orderSummary: OrderSummary = {
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0
  };


  isLoading: boolean = false;

  constructor(
    private router: Router,
    private cartService: CartService) {
  }

  ngOnInit(): void {
    this.loadSavedAddress();
    this.loadOrderSummary();
  }

  loadSavedAddress(): void {
    // Load saved address from service or localStorage
    const savedAddress = localStorage.getItem('savedShippingAddress');
    if (savedAddress) {
      this.addressData = { ...this.addressData, ...JSON.parse(savedAddress) };
    }
  }

  loadOrderSummary(): void {
    this.orderSummary = {
      subtotal: this.cartService.getSubtotal(),
      discount: this.cartService.getDiscount(),
      shipping: 0, // Free shipping
      total: this.cartService.getTotal()
    };
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    // Save address if requested
    if (this.addressData.saveAddress) {
      localStorage.setItem('savedShippingAddress', JSON.stringify(this.addressData));
    }

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      // Navigate to payment method page
      this.router.navigate(['/checkout/payment']);
    }, 1000);
  }

  validateForm(): boolean {
    return !!(
              this.addressData.address && 
              this.addressData.city && 
              this.addressData.state && 
              this.addressData.postcode && 
              this.addressData.country);
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}
