import { Injectable } from '@angular/core';
import { defaultUrlMatcher, Router } from '@angular/router';
import { ToastService } from './toast.service';
import { BaseApiService } from './api';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import {
  LoginRequestDto,
  RegisterRequestDto,
  UserInfoDto,
  UserRole,
} from '../models/auth.dto';
import { UserModule } from '../user/user.module';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends BaseApiService {
  private readonly baseUrl = '/api/auth';

  constructor(
    protected override http: HttpClient,
    private router: Router,
    private toastService: ToastService,
    protected override storageService: StorageService
  ) {
    super(http, storageService);
  }

  // Traditional email/password login
  login(credentials: LoginRequestDto): Observable<{ token: string }> {
    return this.post<{ token: string }>(
      this.buildUrl(this.baseUrl+'/login'),
      credentials
    ).pipe(
      tap((response) => {
        this.setCurrentUser(response);
      })
    );
  }


  register(userData: RegisterRequestDto): Observable<{token:string}> {
    return this.post<{token:string}>(
      this.buildUrl(this.baseUrl+`/register`), userData)
      .pipe(
      tap((response) => {
        this.setCurrentUser(response)
      })
    );
  }

  logout(): void {
    this.clearAuthData();
  }

  // User management
  getCurrentUser(): UserInfoDto | null {
    const userInfo = this.storageService.getLocalObject<UserInfoDto>('currentUser');
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

  getUserRole(): string | null {
    const currentUser = this.storageService.getLocalObject<any>('currentUser');
    return currentUser?.role || null;
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
      // case 'admin':
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

      const decodedToken = jwtDecode(token);
      if (!decodedToken.exp) return false;

      const currentTime = Math.floor(Date.now() / 1000);

      return decodedToken.exp > currentTime;
    } catch {
      return false;
    }
  }
}
