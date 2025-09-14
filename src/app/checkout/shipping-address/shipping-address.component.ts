import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AddressData, OrderSummary, CreateShippingAddressRequestDto, ShippingAddressDto } from '../../models';
import { CartService } from '../../services/cart.service';
import { ShippingAddressApiService } from '../../services/api/shipping-address-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ShippingAddressComponent implements OnInit {
  addressData: AddressData = {
    addressLine1: '',
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

  savedAddresses: ShippingAddressDto[] = [];
  selectedAddressId: number | null = null;
  useExistingAddress: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private shippingAddressService: ShippingAddressApiService,
    private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.loadSavedAddresses();
    this.loadOrderSummary();
  }

  loadSavedAddresses(): void {
    // Check if user is logged in before making API call
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      console.warn('No access token found, falling back to localStorage');
      this.loadSavedAddressFromLocalStorage();
      return;
    }

    this.shippingAddressService.getShippingAddresses().subscribe({
      next: (addresses) => {
        this.savedAddresses = addresses;
        // Select first address if available
        if (addresses.length > 0) {
          this.selectedAddressId = addresses[0].id;
          this.useExistingAddress = true;
        }
      },
      error: (error) => {
        console.error('Error loading saved addresses:', error);
        // Fallback to localStorage
        this.loadSavedAddressFromLocalStorage();
      }
    });
  }

  loadSavedAddressFromLocalStorage(): void {
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
    if (this.useExistingAddress) {
      if (!this.selectedAddressId) {
        this.toastService.error('Please select an address');
        return;
      }
      this.proceedToPayment();
    } else {
      if (!this.validateForm()) {
        return;
      }
      this.saveAndProceed();
    }
  }

  saveAndProceed(): void {
    this.isLoading = true;

    if (this.addressData.saveAddress) {
      // Create new shipping address
      const addressRequest: CreateShippingAddressRequestDto = {
        addressLine1: this.addressData.addressLine1,
        city: this.addressData.city,
        county: this.addressData.state,
        postcode: this.addressData.postcode,
        country: this.addressData.country,
      };

      this.shippingAddressService.createShippingAddress(addressRequest).subscribe({
        next: (response) => {
          this.toastService.success('Address saved successfully');
          this.selectedAddressId = response.id;
          this.proceedToPayment();
        },
        error: (error) => {
          console.error('Error saving address:', error);
          this.toastService.error('Failed to save address');
          this.isLoading = false;
        }
      });
    } else {
      // Just proceed without saving
      this.proceedToPayment();
    }
  }

  proceedToPayment(): void {
    // Store selected address ID for use in payment/order creation
    if (this.selectedAddressId) {
      localStorage.setItem('selectedShippingAddressId', this.selectedAddressId.toString());
    }
    
    // Store delivery instructions
    if (this.addressData.instructions) {
      localStorage.setItem('deliveryInstructions', this.addressData.instructions);
    }

    this.isLoading = false;
    this.router.navigate(['/checkout/payment']);
  }

  selectExistingAddress(addressId: number): void {
    this.selectedAddressId = addressId;
  }

  toggleAddressMode(): void {
    this.useExistingAddress = !this.useExistingAddress;
    if (this.useExistingAddress) {
      this.selectedAddressId = this.savedAddresses.length > 0 ? this.savedAddresses[0].id : null;
    }
  }

  validateForm(): boolean {
    return !!(
              this.addressData.addressLine1 && 
              this.addressData.city && 
              this.addressData.state && 
              this.addressData.postcode && 
              this.addressData.country);
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}
