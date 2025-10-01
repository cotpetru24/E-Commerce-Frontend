import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { UserProfileDto, UpdateUserProfileRequestDto, ChangePasswordRequestDto, UserStatsDto } from '../../models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends BaseApiService {
  private readonly userEndpoint = '/api/User';

  getUserProfile(): Observable<UserProfileDto> {
    const url = this.buildUrl(this.userEndpoint + '/profile');
    this.logRequest('GET', url);
    return this.get<UserProfileDto>(url);
  }

  updateUserProfile(request: UpdateUserProfileRequestDto): Observable<{ message: string }> {
    const url = this.buildUrl(this.userEndpoint + '/profile');
    this.logRequest('PUT', url, request);
    return this.put<{ message: string }>(url, request);
  }

  changePassword(request: ChangePasswordRequestDto): Observable<{ message: string }> {
    const url = this.buildUrl(this.userEndpoint + '/change-password');
    return this.put<{ message: string }>(url, request);
  }

  getUserStats(): Observable<UserStatsDto> {
    const url = this.buildUrl(this.userEndpoint + '/stats');
    this.logRequest('GET', url);
    return this.get<UserStatsDto>(url);
  }
}