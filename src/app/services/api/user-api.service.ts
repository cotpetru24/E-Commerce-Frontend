import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

// ============================================================================
// USER API SERVICE
// ============================================================================
// Handles all user-related API calls: authentication, profile, orders, etc.

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly baseUrl = '/api/users';
  private readonly authUrl = '/api/auth';
  
  constructor(private http: HttpClient) {}

  // ============================================================================
  // AUTHENTICATION ENDPOINTS
  // ============================================================================

  /**
   * User login
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * User registration
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, userData).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * User logout
   */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/logout`, {}).pipe(
      tap(() => {
        // Clear tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<{ token: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<{ token: string }>(`${this.authUrl}/refresh`, {
      refreshToken
    }).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.token);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Forgot password
   */
  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/forgot-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Reset password
   */
  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/reset-password`, {
      token,
      newPassword
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // USER PROFILE ENDPOINTS
  // ============================================================================

  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/me`, updates).pipe(
      tap(updatedUser => console.log('Profile updated:', updatedUser)),
      catchError(this.handleError)
    );
  }

  /**
   * Change password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/me/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update user address
   */
  updateAddress(address: Address): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/me/address`, { address }).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // USER ORDERS ENDPOINTS
  // ============================================================================

  /**
   * Get user orders
   */
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/me/orders`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Get specific order
   */
  getOrder(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/me/orders/${orderId}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/me/orders/${orderId}/cancel`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // USER WISHLIST ENDPOINTS
  // ============================================================================

  /**
   * Get user wishlist
   */
  getWishlist(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/me/wishlist`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Add item to wishlist
   */
  addToWishlist(productId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/me/wishlist`, { productId }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Remove item from wishlist
   */
  removeFromWishlist(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/me/wishlist/${productId}`).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // USER REVIEWS ENDPOINTS
  // ============================================================================

  /**
   * Get user reviews
   */
  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/me/reviews`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Create product review
   */
  createReview(productId: number, review: {
    rating: number;
    comment: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/me/reviews`, {
      productId,
      ...review
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update review
   */
  updateReview(reviewId: number, updates: {
    rating?: number;
    comment?: string;
  }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/me/reviews/${reviewId}`, updates).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete review
   */
  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/me/reviews/${reviewId}`).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    
    console.error('User API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 