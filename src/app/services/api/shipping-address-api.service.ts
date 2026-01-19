import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  ShippingAddressDto,
  CreateShippingAddressRequestDto,
  UpdateShippingAddressRequestDto,
  CreateShippingAddressResponseDto,
  DeleteShippingAddressResponseDto,
} from '@dtos';

@Injectable({
  providedIn: 'root',
})

export class ShippingAddressApiService extends BaseApiService {
  private readonly shippingAddressEndpoint = '/api/order/shipping-addresses';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  createShippingAddress(
    request: CreateShippingAddressRequestDto
  ): Observable<CreateShippingAddressResponseDto> {
    const url = this.buildUrl(this.shippingAddressEndpoint);
    return this.post<
      CreateShippingAddressResponseDto,
      CreateShippingAddressRequestDto
    >(url, request);
  }

  getShippingAddresses(): Observable<ShippingAddressDto[]> {
    const url = this.buildUrl(this.shippingAddressEndpoint);
    return this.get<ShippingAddressDto[]>(url);
  }

  getShippingAddress(addressId: number): Observable<ShippingAddressDto> {
    const url = this.buildUrl(`${this.shippingAddressEndpoint}/${addressId}`);
    return this.get<ShippingAddressDto>(url);
  }

  updateShippingAddress(
    addressId: number,
    request: UpdateShippingAddressRequestDto
  ): Observable<CreateShippingAddressResponseDto> {
    const url = this.buildUrl(`${this.shippingAddressEndpoint}/${addressId}`);
    return this.put<
      CreateShippingAddressResponseDto,
      UpdateShippingAddressRequestDto
    >(url, request);
  }

  deleteShippingAddress(
    addressId: number
  ): Observable<DeleteShippingAddressResponseDto> {
    const url = this.buildUrl(`${this.shippingAddressEndpoint}/${addressId}`);
    return this.delete<DeleteShippingAddressResponseDto>(url);
  }
}
