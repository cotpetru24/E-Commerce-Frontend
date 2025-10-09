import { Injectable } from '@angular/core';
import { defaultUrlMatcher, Router } from '@angular/router';
import { ToastService } from './toast.service';
import { BaseApiService } from './api';
import { readonly } from 'zod';
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
    private toastService: ToastService
  ) {
    super(http);
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

  // /**
  //  * Forgot password
  //  */
  // forgotPassword(email: string): Observable<void> {
  //   return this.http
  //     .post<void>(`${this.authUrl}/forgot-password`, { email })
  //     .pipe(catchError(this.handleError));
  // }

  // /**
  //  * Reset password
  //  */
  // resetPassword(token: string, newPassword: string): Observable<void> {
  //   return this.http
  //     .post<void>(`${this.authUrl}/reset-password`, {
  //       token,
  //       newPassword,
  //     })
  //     .pipe(catchError(this.handleError));
  // }


  logout(): void {
    this.clearAuthData();
  }

  // // SSO Authentication methods
  // signInWithGoogle(): Promise<UserDto> {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const user: UserInFo = {
  //         id: 'google-' + Date.now(),
  //         email: 'user@gmail.com',
  //         name: 'John Doe',
  //         firstName: 'John',
  //         lastName: 'Doe',
  //         picture: 'https://via.placeholder.com/150',
  //         provider: 'google',
  //         loginMethod: 'sso',
  //         loginTime: new Date().toISOString(),
  //       };
  //       this.setCurrentUser(user);
  //       resolve(user);
  //     }, 2000);
  //   });
  // }

  // signInWithGitHub(): Promise<UserDto> {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const user: User = {
  //         id: 'github-' + Date.now(),
  //         email: 'user@github.com',
  //         name: 'Jane Smith',
  //         firstName: 'Jane',
  //         lastName: 'Smith',
  //         picture: 'https://via.placeholder.com/150',
  //         provider: 'github',
  //         loginMethod: 'sso',
  //         loginTime: new Date().toISOString(),
  //       };
  //       this.setCurrentUser(user);
  //       resolve(user);
  //     }, 2000);
  //   });
  // }

  // signInWithFacebook(): Promise<UserDto> {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const user: User = {
  //         id: 'facebook-' + Date.now(),
  //         email: 'user@facebook.com',
  //         name: 'Mike Johnson',
  //         firstName: 'Mike',
  //         lastName: 'Johnson',
  //         picture: 'https://via.placeholder.com/150',
  //         provider: 'facebook',
  //         loginMethod: 'sso',
  //         loginTime: new Date().toISOString(),
  //       };
  //       this.setCurrentUser(user);
  //       resolve(user);
  //     }, 2000);
  //   });
  // }

  // Registration methods

  // // SSO Registration methods
  // signUpWithGoogle(): Promise<UserDto> {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const user: User = {
  //         id: 'google-' + Date.now(),
  //         email: 'newuser@gmail.com',
  //         name: 'New User',
  //         firstName: 'New',
  //         lastName: 'User',
  //         picture: 'https://via.placeholder.com/150',
  //         provider: 'google',
  //         loginMethod: 'sso',
  //         registrationTime: new Date().toISOString(),
  //       };
  //       this.setCurrentUser(user);
  //       resolve(user);
  //     }, 2000);
  //   });
  // }

  // signUpWithGitHub(): Promise<UserDto> {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const user: User = {
  //         id: 'github-' + Date.now(),
  //         email: 'newuser@github.com',
  //         name: 'GitHub User',
  //         firstName: 'GitHub',
  //         lastName: 'User',
  //         picture: 'https://via.placeholder.com/150',
  //         provider: 'github',
  //         loginMethod: 'sso',
  //         registrationTime: new Date().toISOString(),
  //       };
  //       this.setCurrentUser(user);
  //       resolve(user);
  //     }, 2000);
  //   });
  // }

  // signUpWithFacebook(): Promise<UserDto> {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const user: User = {
  //         id: 'facebook-' + Date.now(),
  //         email: 'newuser@facebook.com',
  //         name: 'Facebook User',
  //         firstName: 'Facebook',
  //         lastName: 'User',
  //         picture: 'https://via.placeholder.com/150',
  //         provider: 'facebook',
  //         loginMethod: 'sso',
  //         registrationTime: new Date().toISOString(),
  //       };
  //       this.setCurrentUser(user);
  //       resolve(user);
  //     }, 2000);
  //   });
  // }

  // User management
  getCurrentUser(): UserInfoDto | null {
    try {
      const userInfo = localStorage.getItem('currentUser');
      if (!userInfo) return null;

      const parsedUser: UserInfoDto = JSON.parse(userInfo);
      return {
        Id: parsedUser.Id,
        Email: parsedUser.Email,
        FirstName: parsedUser.FirstName,
        role: this.validateRole(parsedUser.role),
      };
    } catch (err) {
      console.error('Failed to get current user:', err);
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('accessToken');
    const currentUser = localStorage.getItem('currentUser');
    return !!(token && currentUser && this.isTokenValid());
  }

  isAdmin(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.role === UserRole.ADMINISTRATOR;
  }

  getUserRole(): string | null {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) return null;
      const parsedUser = JSON.parse(currentUser);
      return parsedUser.role || null;
    } catch {
      console.log('Failed to get user role');
      return null;
    }
  }

  private setCurrentUser(response: { token: string }): void {
    if (!response.token) {
      throw new Error('Invalid token!');
    }

    try {
      sessionStorage.setItem('accessToken', response.token);

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

      localStorage.setItem('currentUser', JSON.stringify(userInfo));
    } catch (err) {
      this.clearAuthData();
      throw new Error('Failed to store user data');
    }
  }

  private validateRole(role: string): UserRole {
    switch (role.toLocaleLowerCase()) {
      case 'customer':
        return UserRole.CUSTOMER;
      case 'admin':
      case 'administrator':
        return UserRole.ADMINISTRATOR;
      default:
        return UserRole.CUSTOMER;
    }
  }

  private clearAuthData(): void {
    try {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }

  isTokenValid(): boolean {
    try {
      const token = sessionStorage.getItem('accessToken');
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
