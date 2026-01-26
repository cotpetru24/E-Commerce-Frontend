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
export class AddressApiService extends BaseApiService {
  private readonly addressEndpoint = '/api/address';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  createAddress(
    request: CreateAddressRequestDto,
  ): Observable<CreateAddressResponseDto> {
    const url = this.buildUrl(this.addressEndpoint);
    return this.post<CreateAddressResponseDto, CreateAddressRequestDto>(
      url,
      request,
    );
  }

  getAddressById(addressId: number): Observable<AddressDto> {
    const url = this.buildUrl(`${this.addressEndpoint}/${addressId}`);
    return this.get<AddressDto>(url);
  }

  getUserAddresses(): Observable<AddressDto[]> {
    const url = this.buildUrl(this.addressEndpoint);
    return this.get<AddressDto[]>(url);
  }

  updateAddress(
    addressId: number,
    request: AddressDto,
  ): Observable<CreateAddressResponseDto> {
    const url = this.buildUrl(`${this.addressEndpoint}/${addressId}`);
    return this.put<CreateAddressResponseDto, AddressDto>(url, request);
  }

  deleteShippingAddress(
    addressId: number,
  ): Observable<DeleteAddressResponseDto> {
    const url = this.buildUrl(`${this.addressEndpoint}/${addressId}`);
    return this.delete<DeleteAddressResponseDto>(url);
  }
}
