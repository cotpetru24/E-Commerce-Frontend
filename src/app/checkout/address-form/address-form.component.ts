import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AddressData, OrderSummary } from '../../models';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AddressFormComponent implements OnInit {
  addressData: AddressData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    instructions: '',
    saveAddress: false
  };

  orderSummary: OrderSummary = {
    subtotal: 0,
    shipping: 0,
    total: 0
  };

  isLoading: boolean = false;

  constructor(private router: Router) {}

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

    // Save address if requested
    if (this.addressData.saveAddress) {
      localStorage.setItem('savedShippingAddress', JSON.stringify(this.addressData));
    }

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      // Navigate to payment method page
      this.router.navigate(['/checkout/payment-method']);
    }, 1000);
  }

  validateForm(): boolean {
    return !!(this.addressData.firstName && 
              this.addressData.lastName && 
              this.addressData.email && 
              this.addressData.phone && 
              this.addressData.address && 
              this.addressData.city && 
              this.addressData.state && 
              this.addressData.zipCode && 
              this.addressData.country);
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}
