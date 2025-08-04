import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface AddressData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  instructions: string;
  saveAddress: boolean;
}

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
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

  isLoading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadSavedAddress();
  }

  loadSavedAddress(): void {
    // Load saved address from service or localStorage
    const savedAddress = localStorage.getItem('savedShippingAddress');
    if (savedAddress) {
      this.addressData = { ...this.addressData, ...JSON.parse(savedAddress) };
    }
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
