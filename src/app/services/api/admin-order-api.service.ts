import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { StorageService } from '../storage.service';
import {
  GetAllOrdersRequestDto,
  GetAllOrdersResponseDto,
  AdminOrderDto,
  UpdateOrderStatusRequestDto,
} from '../../models';

// Type alias for response DTO
type AdminOrderListDto = GetAllOrdersResponseDto;

// ============================================================================
// ADMIN ORDER API SERVICE
// ============================================================================
// Handles admin order management API calls

@Injectable({
  providedIn: 'root',
})
export class AdminOrderApiService extends BaseApiService {
  private readonly endPoint = '/api/admin/orders';

  constructor(
    protected override http: HttpClient,
    protected override storageService: StorageService
  ) {
    super(http, storageService);
  }

  /**
   * Get all orders with pagination and filtering
   */
  getOrders(request: GetAllOrdersRequestDto): Observable<AdminOrderListDto> {
    const url = this.buildUrl(this.endPoint);
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

    this.logRequest('GET', url, request);

    return this.get<AdminOrderListDto>(url, { params }).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Get specific order by ID
   */
  getOrderById(orderId: number): Observable<AdminOrderDto> {
    const url = this.buildUrl(`${this.endPoint}/${orderId}`);
    this.logRequest('GET', url);

    return this.get<AdminOrderDto>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update order status
   */
  updateOrderStatus(
    orderId: number,
    statusData: UpdateOrderStatusRequestDto
  ): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/${orderId}/status`);
    this.logRequest('PUT', url, statusData);

    return this.put<any>(url, statusData).pipe(
      tap((response) => this.logResponse('PUT', url, response)),
      catchError(this.handleError)
    );
  }
}
