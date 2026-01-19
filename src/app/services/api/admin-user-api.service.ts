import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  AdminOrderDto,
  AdminUpdateUserProfileRequestDto,
  AdminUserDto,
  GetAllUsersRequestDto,
  GetAllUsersResponseDto,
  GetUserOrdersRequestDto,
  AdminChangePasswordResponseDto,
  UpdateUserProfileRequestDto,
} from '@dtos';

@Injectable({
  providedIn: 'root',
})
export class AdminUserApiService extends BaseApiService {
  private readonly adminUserEndPoint = '/api/admin/users';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getUsers(request: GetAllUsersRequestDto): Observable<GetAllUsersResponseDto> {
    const url = this.buildUrl(this.adminUserEndPoint);
    const params = this.createParams({
      pageNumber: request?.pageNumber || 1,
      pageSize: request?.pageSize || 10,
      ...(request?.searchTerm && { searchTerm: request.searchTerm }),
      ...(request?.sortDirection !== undefined &&
        request?.sortDirection !== null && {
          sortDirection: request.sortDirection,
        }),
      ...(request?.sortBy !== undefined &&
        request?.sortBy !== null && { sortBy: request.sortBy }),
      ...(request?.userStatus && { userStatus: request.userStatus }),
      ...(request?.userRole && { userRole: request.userRole }),
    });

    return this.get<GetAllUsersResponseDto>(url, { params });
  }

  getUserById(userId: string): Observable<AdminUserDto> {
    const url = this.buildUrl(`${this.adminUserEndPoint}/${userId}`);
    return this.get<AdminUserDto>(url);
  }

  updateUser(
    userId: string,
    updates: UpdateUserProfileRequestDto,
  ): Observable<{ message: string }> {
    const url = this.buildUrl(`${this.adminUserEndPoint}/${userId}`);
    return this.put<{ message: string }>(url, updates);
  }

  toggleUserStatus(
    userId: string,
    request: AdminUpdateUserProfileRequestDto,
  ): Observable<any> {
    const url = this.buildUrl(`${this.adminUserEndPoint}/users/${userId}`);
    return this.put<
      UpdateUserProfileRequestDto,
      AdminUpdateUserProfileRequestDto
    >(url, request);
  }

  deleteUser(userId: string): Observable<{ message: string }> {
    const url = this.buildUrl(`${this.adminUserEndPoint}/${userId}`);
    return this.delete<{ message: string }>(url);
  }

  updateUserPassword(
    userId: string,
    passwordData: AdminChangePasswordResponseDto,
  ): Observable<{ message: string }> {
    const url = this.buildUrl(`${this.adminUserEndPoint}/${userId}/password`);
    return this.put<{ message: string }>(url, passwordData);
  }

  getUserOrders(
    userId: string,
    request: GetUserOrdersRequestDto,
  ): Observable<AdminOrderDto[]> {
    const url = this.buildUrl(`${this.adminUserEndPoint}/${userId}/orders`);
    const params = this.createParams({
      pageNumber: request?.pageNumber || 1,
      pageSize: request?.pageSize || 10,
      ...(request?.statusFilter && { statusFilter: request.statusFilter }),
      ...(request?.fromDate && { fromDate: request.fromDate.toISOString() }),
      ...(request?.toDate && { toDate: request.toDate.toISOString() }),
    });

    return this.get<AdminOrderDto[]>(url, { params });
  }
}
