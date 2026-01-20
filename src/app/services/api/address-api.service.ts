import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  AddressDto,
  CreateAddressRequestDto,
  CreateAddressResponseDto,
  DeleteAddressResponseDto,
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
    request: CreateAddressRequestDto
  ): Observable<CreateAddressResponseDto> {
    const url = this.buildUrl(this.shippingAddressEndpoint);
    return this.post<
      CreateAddressResponseDto,
      CreateAddressRequestDto
    >(url, request);
  }

  getShippingAddresses(): Observable<AddressDto[]> {
    const url = this.buildUrl(this.shippingAddressEndpoint);
    return this.get<AddressDto[]>(url);
  }

  getShippingAddress(addressId: number): Observable<AddressDto> {
    const url = this.buildUrl(`${this.shippingAddressEndpoint}/${addressId}`);
    return this.get<AddressDto>(url);
  }

  updateShippingAddress(
    addressId: number,
    request: AddressDto
  ): Observable<CreateAddressResponseDto> {
    const url = this.buildUrl(`${this.shippingAddressEndpoint}/${addressId}`);
    return this.put<
      CreateAddressResponseDto,
      AddressDto
    >(url, request);
  }

  deleteShippingAddress(
    addressId: number
  ): Observable<DeleteAddressResponseDto> {
    const url = this.buildUrl(`${this.shippingAddressEndpoint}/${addressId}`);
    return this.delete<DeleteAddressResponseDto>(url);
  }
}
