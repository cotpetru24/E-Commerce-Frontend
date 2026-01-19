import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { StorageService } from '../storage.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import {
  LoginRequestDto,
  RegisterRequestDto,
  UserInfoDto,
  UserRole,
} from '@dtos';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends BaseApiService {
  private readonly authEndpoint = '/api/auth';

  constructor(
    protected override http: HttpClient,
    protected storageService: StorageService,
  ) {
    super(http);
  }

  login(credentials: LoginRequestDto): Observable<{ token: string }> {
    return this.post<{ token: string }>(
      this.buildUrl(this.authEndpoint + '/login'),
      credentials,
    ).pipe(
      tap((response) => {
        this.setCurrentUser(response);
      }),
    );
  }

  register(userData: RegisterRequestDto): Observable<{ token: string }> {
    return this.post<{ token: string }>(
      this.buildUrl(this.authEndpoint + `/register`),
      userData,
    ).pipe(
      tap((response) => {
        this.setCurrentUser(response);
      }),
    );
  }

  logout(): void {
    this.clearAuthData();
  }

  getCurrentUser(): UserInfoDto | null {
    const userInfo =
      this.storageService.getLocalObject<UserInfoDto>('currentUser');
    if (!userInfo) return null;

    return {
      Id: userInfo.Id,
      Email: userInfo.Email,
      FirstName: userInfo.FirstName,
      role: this.validateRole(userInfo.role),
    };
  }

  isLoggedIn(): boolean {
    const token = this.storageService.getSessionItem('accessToken');
    const currentUser = this.storageService.getLocalItem('currentUser');
    return !!(token && currentUser && this.isTokenValid());
  }

  isAdmin(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.role === UserRole.Administrator;
  }

  getUserRole(): UserRole | null {
    return this.getCurrentUser()?.role ?? null;
  }

  private setCurrentUser(response: { token: string }): void {
    if (!response.token) {
      throw new Error('Invalid token!');
    }

    try {
      this.storageService.setSessionItem('accessToken', response.token);

      const token = jwtDecode<UserInfoDto>(response.token);

      if (!token || !token.FirstName || !token.role) {
        throw new Error('Invalid JWT token.');
      }

      const userInfo = {
        Id: token.Id,
        FirstName: token.FirstName,
        Email: token.Email,
        role: this.validateRole(token.role),
      };

      this.storageService.setLocalObject('currentUser', userInfo);
    } catch (err) {
      this.clearAuthData();
      throw new Error('Failed to store user data');
    }
  }

  private validateRole(role: UserRole | string): UserRole {
    switch (role) {
      case UserRole.Customer:
      case 'Customer':
        return UserRole.Customer;
      case UserRole.Administrator:
      case 'Administrator':
        return UserRole.Administrator;
      default:
        return UserRole.Customer;
    }
  }

  private clearAuthData(): void {
    this.storageService.removeSessionItem('accessToken');
    this.storageService.removeSessionItem('refreshToken');
    this.storageService.removeLocalItem('currentUser');
  }

  isTokenValid(): boolean {
    try {
      const token = this.storageService.getSessionItem('accessToken');
      if (!token) return false;

      const decodedToken = jwtDecode<{ exp: number }>(token);
      if (!decodedToken.exp) return false;

      return decodedToken.exp > Math.floor(Date.now() / 1000);
    } catch {
      return false;
    }
  }
}
