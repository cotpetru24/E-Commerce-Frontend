import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  GetAllOrdersRequestDto,
  GetAllOrdersResponseDto,
  AdminOrderDto,
  UpdateOrderStatusRequestDto,
} from '../../dtos';

@Injectable({
  providedIn: 'root',
})

export class AdminOrderApiService extends BaseApiService {
  private readonly adminOrderEndPoint = '/api/admin/orders';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getOrders(
    request: GetAllOrdersRequestDto
  ): Observable<GetAllOrdersResponseDto> {
    const url = this.buildUrl(this.adminOrderEndPoint);
    const params = this.createParams({
      pageNumber: request?.pageNumber || 1,
      pageSize: request?.pageSize || 10,
      ...(request?.searchTerm && { searchTerm: request.searchTerm }),
      ...(request?.orderStatus && { statusFilter: request.orderStatus }),
      ...(request?.fromDate && { fromDate: request.fromDate.toISOString() }),
      ...(request?.toDate && { toDate: request.toDate.toISOString() }),
      ...(request?.sortBy !== undefined &&
        request?.sortBy !== null && { sortBy: request.sortBy }),
      ...(request?.sortDirection !== undefined &&
        request?.sortDirection !== null && {
          sortDirection: request.sortDirection,
        }),
    });

    return this.get<GetAllOrdersResponseDto>(url, { params });
  }

  getOrderById(orderId: number): Observable<AdminOrderDto> {
    const url = this.buildUrl(`${this.adminOrderEndPoint}/${orderId}`);
    return this.get<AdminOrderDto>(url);
  }

  updateOrderStatus(
    orderId: number,
    statusData: UpdateOrderStatusRequestDto
  ): Observable<{ message: string }> {
    const url = this.buildUrl(`${this.adminOrderEndPoint}/${orderId}/status`);
    return this.put<{ message: string }>(url, statusData);
  }
}
