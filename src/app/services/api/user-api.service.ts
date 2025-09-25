import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { UserProfileDto, UpdateUserProfileRequestDto, ChangePasswordRequestDto, UserStatsDto } from '../../models/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends BaseApiService {
  private readonly baseUrl = `${this.apiBaseUrl}/user`;

  getUserProfile(): Observable<UserProfileDto> {
    return this.get<UserProfileDto>(`${this.baseUrl}/profile`);
  }

  updateUserProfile(request: UpdateUserProfileRequestDto): Observable<{ message: string }> {
    return this.put<{ message: string }>(`${this.baseUrl}/profile`, request);
  }

  changePassword(request: ChangePasswordRequestDto): Observable<{ message: string }> {
    return this.put<{ message: string }>(`${this.baseUrl}/change-password`, request);
  }

  getUserStats(): Observable<UserStatsDto> {
    return this.get<UserStatsDto>(`${this.baseUrl}/stats`);
  }
}