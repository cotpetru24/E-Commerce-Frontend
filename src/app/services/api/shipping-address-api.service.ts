import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { StorageService } from '../storage.service';
import {
  ShippingAddressDto,
  CreateShippingAddressRequestDto,
  UpdateShippingAddressRequestDto,
  ShippingAddressResponseDto,
} from '../../models/shipping-address.dto';

@Injectable({
  providedIn: 'root',
})
export class ShippingAddressApiService extends BaseApiService {
  private readonly shippingAddressEndpoint = '/api/order/shipping-addresses';

  constructor(
    protected override http: HttpClient,
    protected override storageService: StorageService
  ) {
    super(http, storageService);
  }

  // ============================================================================
  // SHIPPING ADDRESS METHODS
  // ============================================================================

  /**
   * Create a new shipping address
   */
  createShippingAddress(request: CreateShippingAddressRequestDto): Observable<ShippingAddressResponseDto> {
    const url = this.buildUrl(this.shippingAddressEndpoint);
    this.logRequest('POST', url, request);
    
    return this.post<ShippingAddressResponseDto, CreateShippingAddressRequestDto>(url, request)
      .pipe(
        tap(response => this.logResponse('POST', url, response))
      );
  }

  /**
   * Get all user's shipping addresses
   */
  getShippingAddresses(): Observable<ShippingAddressDto[]> {
    const url = this.buildUrl(this.shippingAddressEndpoint);
    this.logRequest('GET', url);
    
    return this.get<ShippingAddressDto[]>(url)
      .pipe(
        tap(response => this.logResponse('GET', url, response))
      );
  }

  /**
   * Get a specific shipping address by ID
   */
  getShippingAddress(addressId: number): Observable<ShippingAddressDto> {
    const url = this.buildUrl(`${this.shippingAddressEndpoint}/${addressId}`);
    this.logRequest('GET', url);
    
    return this.get<ShippingAddressDto>(url)
      .pipe(
        tap(response => this.logResponse('GET', url, response))
      );
  }

  /**
   * Update a shipping address
   */
  updateShippingAddress(addressId: number, request: UpdateShippingAddressRequestDto): Observable<ShippingAddressResponseDto> {
    const url = this.buildUrl(`${this.shippingAddressEndpoint}/${addressId}`);
    this.logRequest('PUT', url, request);
    
    return this.put<ShippingAddressResponseDto, UpdateShippingAddressRequestDto>(url, request)
      .pipe(
        tap(response => this.logResponse('PUT', url, response))
      );
  }

  /**
   * Delete a shipping address
   */
  deleteShippingAddress(addressId: number): Observable<{ message: string }> {
    const url = this.buildUrl(`${this.shippingAddressEndpoint}/${addressId}`);
    this.logRequest('DELETE', url);
    
    return this.delete<{ message: string }>(url)
      .pipe(
        tap(response => this.logResponse('DELETE', url, response))
      );
  }

  /**
   * Set a shipping address as default
   */
  setDefaultShippingAddress(addressId: number): Observable<ShippingAddressResponseDto> {
    const url = this.buildUrl(`${this.shippingAddressEndpoint}/${addressId}/set-default`);
    this.logRequest('PUT', url);
    
    return this.put<ShippingAddressResponseDto>(url, {})
      .pipe(
        tap(response => this.logResponse('PUT', url, response))
      );
  }
}


