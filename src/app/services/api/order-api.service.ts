import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  OrderDto,
  PlaceOrderRequestDto,
  PlaceOrderResponseDto,
  GetUserOrdersRequestDto,
  GetUserOrdersResponseDto,
} from '@dtos';

@Injectable({
  providedIn: 'root',
})
export class OrderApiService extends BaseApiService {
  private readonly orderEndPoint = '/api/Order';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  placeOrder(request: PlaceOrderRequestDto): Observable<PlaceOrderResponseDto> {
    const url = this.buildUrl(this.orderEndPoint);
    return this.post<PlaceOrderResponseDto, PlaceOrderRequestDto>(url, request);
  }

  getOrder(orderId: number): Observable<OrderDto> {
    const url = this.buildUrl(`${this.orderEndPoint}/${orderId}`);
    return this.get<OrderDto>(url);
  }

  getOrders(
    request: GetUserOrdersRequestDto,
  ): Observable<GetUserOrdersResponseDto> {
    const url = this.buildUrl(this.orderEndPoint);
    const params = this.createParams({
      page: request.pageNumber,
      pageSize: request.pageSize,
      ...(request.statusFilter && { orderStatus: request.statusFilter }),
      ...(request.fromDate && { fromDate: request.fromDate.toISOString() }),
      ...(request.toDate && { toDate: request.toDate.toISOString() }),
    });

    return this.get<GetUserOrdersResponseDto>(url, { params });
  }

  cancelOrder(orderId: number): Observable<OrderDto> {
    const url = this.buildUrl(`${this.orderEndPoint}/cancel-order/${orderId}`);
    return this.put<OrderDto>(url, undefined);
  }
}
