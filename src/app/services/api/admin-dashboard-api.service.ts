import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { DashboardStatsDto } from '@dtos';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardApiService extends BaseApiService {
  private readonly adminDashboardEndPoint = '/api/admin/dashboard';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getDashboardStats(): Observable<DashboardStatsDto> {
    const url = this.buildUrl(this.adminDashboardEndPoint);
    return this.get<DashboardStatsDto>(url);
  }
}
