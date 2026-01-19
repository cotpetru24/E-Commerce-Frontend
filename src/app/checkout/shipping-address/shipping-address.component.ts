import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ShippingAddressApiService } from '../../services/api/shipping-address-api.service';
import { ToastService } from '../../services/toast.service';
import { StorageService } from '../../services/storage.service';
import { AddressData } from '../checkout.types';
import {
  OrderSummary,
  CreateShippingAddressRequestDto,
  ShippingAddressDto,
} from '@dtos';

@Component({
  selector: 'shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class ShippingAddressComponent implements OnInit {
  savedAddresses: ShippingAddressDto[] = [];
  selectedAddressId: number | null = null;
  useExistingAddress: boolean = false;
  isLoading: boolean = false;

  addressData: AddressData = {
    addressLine1: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    instructions: '',
    saveAddress: false,
  };

  orderSummary: OrderSummary = {
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0,
  };

  constructor(
    private router: Router,
    private cartService: CartService,
    private shippingAddressService: ShippingAddressApiService,
    private toastService: ToastService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadSavedAddresses();
    this.loadOrderSummary();
  }

  loadSavedAddresses(): void {
    const token = this.storageService.getSessionItem('accessToken');
    if (!token) {
      this.loadSavedAddressFromLocalStorage();
      return;
    }

    this.shippingAddressService.getShippingAddresses().subscribe({
      next: (addresses) => {
        this.savedAddresses = addresses;
        if (addresses.length > 0) {
          this.selectedAddressId = addresses[0].id;
          this.useExistingAddress = true;
        }
      },
      error: () => {
        this.loadSavedAddressFromLocalStorage();
      },
    });
  }

  loadSavedAddressFromLocalStorage(): void {
    const savedAddress = this.storageService.getLocalObject<any>(
      'savedShippingAddress'
    );
    if (savedAddress) {
      this.addressData = { ...this.addressData, ...savedAddress };
    }
  }

  loadOrderSummary(): void {
    this.orderSummary = {
      subtotal: this.cartService.getSubtotal(),
      discount: this.cartService.getDiscount(),
      shipping: 0,
      total: this.cartService.getTotal(),
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
      const addressRequest: CreateShippingAddressRequestDto = {
        addressLine1: this.addressData.addressLine1,
        city: this.addressData.city,
        county: this.addressData.state,
        postcode: this.addressData.postcode,
        country: this.addressData.country,
      };

      this.shippingAddressService
        .createShippingAddress(addressRequest)
        .subscribe({
          next: (response) => {
            this.toastService.success('Address saved successfully');
            this.selectedAddressId = response.id;
            this.proceedToPayment();
          },
          error: () => {
            this.toastService.error('Failed to save address');
            this.isLoading = false;
          },
        });
    } else {
      this.proceedToPayment();
    }
  }

  proceedToPayment(): void {
    if (this.selectedAddressId) {
      this.storageService.setLocalItem(
        'selectedShippingAddressId',
        this.selectedAddressId.toString()
      );
    }

    if (this.addressData.instructions) {
      this.storageService.setLocalItem(
        'deliveryInstructions',
        this.addressData.instructions
      );
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
      this.selectedAddressId =
        this.savedAddresses.length > 0 ? this.savedAddresses[0].id : null;
    }
  }

  validateForm(): boolean {
    return !!(
      this.addressData.addressLine1 &&
      this.addressData.city &&
      this.addressData.state &&
      this.addressData.postcode &&
      this.addressData.country
    );
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}
