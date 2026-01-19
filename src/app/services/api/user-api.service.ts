import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  UserProfileDto,
  UpdateUserProfileRequestDto,
  ChangePasswordRequestDto,
  UserStatsDto,
  UpdateUserProfileResponseDto,
  ChangePasswordResponseDto,
} from '@dtos';

@Injectable({
  providedIn: 'root',
})
export class UserApiService extends BaseApiService {
  private readonly userEndpoint = '/api/User';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getUserProfile(): Observable<UserProfileDto> {
    const url = this.buildUrl(`${this.userEndpoint}/profile`);
    return this.get<UserProfileDto>(url);
  }

  updateUserProfile(
    request: UpdateUserProfileRequestDto,
  ): Observable<UpdateUserProfileResponseDto> {
    const url = this.buildUrl(`${this.userEndpoint}/profile`);
    return this.put<UpdateUserProfileResponseDto>(url, request);
  }

  changePassword(
    request: ChangePasswordRequestDto,
  ): Observable<ChangePasswordResponseDto> {
    const url = this.buildUrl(`${this.userEndpoint}/change-password`);
    return this.put<ChangePasswordResponseDto>(url, request);
  }

  getUserStats(): Observable<UserStatsDto> {
    const url = this.buildUrl(`${this.userEndpoint}/stats`);
    return this.get<UserStatsDto>(url);
  }
}
