import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { StorageService } from '../storage.service';
import {
  GetAllUsersRequestDto,
  GetAllUsersResponseDto,
} from '../../models';
import { AdminUser } from './admin-api.service';

// Type aliases for request/response DTOs
type AdminUsersListDto = GetAllUsersResponseDto;
type AdminUserDto = AdminUser;
type GetUserOrdersRequestDto = {
  pageNumber?: number;
  pageSize?: number;
  statusFilter?: string;
  fromDate?: Date;
  toDate?: Date;
};
type UpdateUserRequestDto = {
  email?: string;
  firstName?: string;
  lastName?: string;
  isBlocked?: boolean;
  roles?: string[];
};
type CreateUserRequestDto = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles?: string[];
};
type UpdateUserPasswordRequestDto = {
  newPassword: string;
};

// ============================================================================
// ADMIN USER API SERVICE
// ============================================================================
// Handles admin user management API calls

@Injectable({
  providedIn: 'root',
})
export class AdminUserApiService extends BaseApiService {
  private readonly endPoint = '/api/admin/users';

  constructor(
    protected override http: HttpClient,
    protected override storageService: StorageService
  ) {
    super(http, storageService);
  }

  /**
   * Get all users with pagination and filtering
   */
  getUsers(request: GetAllUsersRequestDto): Observable<AdminUsersListDto> {
    const url = this.buildUrl(this.endPoint);
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

    this.logRequest('GET', url, params);

    return this.get<AdminUsersListDto>(url, { params }).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Get user by ID
   */
  getUserById(userId: string): Observable<AdminUserDto> {
    const url = this.buildUrl(`${this.endPoint}/${userId}`);
    this.logRequest('GET', url);

    return this.get<AdminUserDto>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update user
   */
  updateUser(userId: string, updates: UpdateUserRequestDto): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/${userId}`);
    this.logRequest('PUT', url, updates);

    return this.put<any>(url, updates).pipe(
      tap((response) => this.logResponse('PUT', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Create new user
   */
  createUser(userData: CreateUserRequestDto): Observable<any> {
    const url = this.buildUrl(this.endPoint);
    this.logRequest('POST', url, userData);

    return this.post<any>(url, userData).pipe(
      tap((response) => this.logResponse('POST', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Delete user
   */
  deleteUser(userId: string): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/${userId}`);
    this.logRequest('DELETE', url);

    return this.delete<any>(url).pipe(
      tap((response) => this.logResponse('DELETE', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update user password
   */
  updateUserPassword(
    userId: string,
    passwordData: UpdateUserPasswordRequestDto
  ): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/${userId}/password`);
    this.logRequest('PUT', url, { password: '***' }); // Don't log actual password

    return this.put<any>(url, passwordData).pipe(
      tap((response) => this.logResponse('PUT', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Get user orders by userId
   */
  getUserOrders(
    userId: string,
    request: GetUserOrdersRequestDto
  ): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/${userId}/orders`);
    const params = this.createParams({
      pageNumber: request?.pageNumber || 1,
      pageSize: request?.pageSize || 10,
      ...(request?.statusFilter && { statusFilter: request.statusFilter }),
      ...(request?.fromDate && { fromDate: request.fromDate.toISOString() }),
      ...(request?.toDate && { toDate: request.toDate.toISOString() }),
    });

    this.logRequest('GET', url, params);

    return this.get<any>(url, { params }).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }
}
