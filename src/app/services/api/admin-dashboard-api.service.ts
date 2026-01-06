import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { StorageService } from '../storage.service';
import { AdminStats } from './admin-api.service';

// ============================================================================
// ADMIN DASHBOARD API SERVICE
// ============================================================================
// Handles admin dashboard statistics API calls

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardApiService extends BaseApiService {
  private readonly endPoint = '/api/admin/dashboard';

  constructor(
    protected override http: HttpClient,
    protected override storageService: StorageService
  ) {
    super(http, storageService);
  }

  /**
   * Get admin dashboard statistics
   */
  getDashboardStats(): Observable<AdminStats> {
    const url = this.buildUrl(this.endPoint);
    this.logRequest('GET', url);

    return this.get<AdminStats>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }
}
