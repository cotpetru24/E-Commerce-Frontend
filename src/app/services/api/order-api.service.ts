import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';
import {
  OrderDto,
  PlaceOrderRequestDto,
  PlaceOrderResponseDto,
  GetOrdersRequestDto,
  GetOrdersResponseDto,
} from '../../models/order.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderApiService extends BaseApiService {
  private readonly orderEndpoint = '/api/order';

  // ============================================================================
  // ORDER METHODS
  // ============================================================================

  /**
   * Place a new order
   */
  placeOrder(request: PlaceOrderRequestDto): Observable<PlaceOrderResponseDto> {
    const url = this.buildUrl(this.orderEndpoint);
    this.logRequest('POST', url, request);
    
    return this.post<PlaceOrderResponseDto, PlaceOrderRequestDto>(url, request)
      .pipe(
        tap(response => this.logResponse('POST', url, response))
      );
  }

  /**
   * Get a specific order by ID
   */
  getOrder(orderId: number): Observable<OrderDto> {
    const url = this.buildUrl(`${this.orderEndpoint}/${orderId}`);
    this.logRequest('GET', url);
    
    return this.get<OrderDto>(url)
      .pipe(
        tap(response => this.logResponse('GET', url, response))
      );
  }

  /**
   * Get paginated list of user's orders
   */
  getOrders(request: GetOrdersRequestDto): Observable<GetOrdersResponseDto> {
    const url = this.buildUrl(this.orderEndpoint);
    const params = this.createParams({
      page: request.page,
      pageSize: request.pageSize,
      ...(request.orderStatus && { orderStatus: request.orderStatus }),
      ...(request.fromDate && { fromDate: request.fromDate.toISOString() }),
      ...(request.toDate && { toDate: request.toDate.toISOString() }),
    });
    
    this.logRequest('GET', url, request);
    
    return this.get<GetOrdersResponseDto>(url, { params })
      .pipe(
        tap(response => this.logResponse('GET', url, response))
      );
  }

  // ============================================================================
  // SHIPPING ADDRESS METHODS
  // ============================================================================

  /**
   * Create a new shipping address
   */
  createShippingAddress(request: any): Observable<any> {
    const url = this.buildUrl(`${this.orderEndpoint}/shipping-addresses`);
    this.logRequest('POST', url, request);
    
    return this.post(url, request)
      .pipe(
        tap(response => this.logResponse('POST', url, response))
      );
  }

  /**
   * Get all user's shipping addresses
   */
  getShippingAddresses(): Observable<any[]> {
    const url = this.buildUrl(`${this.orderEndpoint}/shipping-addresses`);
    this.logRequest('GET', url);
    
    return this.get<any[]>(url)
      .pipe(
        tap(response => this.logResponse('GET', url, response))
      );
  }

  /**
   * Get a specific shipping address by ID
   */
  getShippingAddress(addressId: number): Observable<any> {
    const url = this.buildUrl(`${this.orderEndpoint}/shipping-addresses/${addressId}`);
    this.logRequest('GET', url);
    
    return this.get<any>(url)
      .pipe(
        tap(response => this.logResponse('GET', url, response))
      );
  }

  /**
   * Update a shipping address
   */
  updateShippingAddress(addressId: number, request: any): Observable<any> {
    const url = this.buildUrl(`${this.orderEndpoint}/shipping-addresses/${addressId}`);
    this.logRequest('PUT', url, request);
    
    return this.put(url, request)
      .pipe(
        tap(response => this.logResponse('PUT', url, response))
      );
  }

  /**
   * Delete a shipping address
   */
  deleteShippingAddress(addressId: number): Observable<any> {
    const url = this.buildUrl(`${this.orderEndpoint}/shipping-addresses/${addressId}`);
    this.logRequest('DELETE', url);
    
    return this.delete(url)
      .pipe(
        tap(response => this.logResponse('DELETE', url, response))
      );
  }

  /**
   * Set a shipping address as default
   */
  setDefaultShippingAddress(addressId: number): Observable<any> {
    const url = this.buildUrl(`${this.orderEndpoint}/shipping-addresses/${addressId}/set-default`);
    this.logRequest('PUT', url);
    
    return this.put(url, {})
      .pipe(
        tap(response => this.logResponse('PUT', url, response))
      );
  }
}
