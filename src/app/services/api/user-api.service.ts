import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { AddressDto, UserDto } from '../../models/user.dto';
import { RegisterRequestDto } from '../../models/auth.dto';

// ============================================================================
// USER API SERVICE
// ============================================================================
// Handles all user-related API calls: authentication, profile, orders, etc.



@Injectable({
  providedIn: 'root',
})

// modify the methods to exted base api service
export class UserApiService extends BaseApiService {
  private readonly baseUrl = '/api/users';
  private readonly authUrl = '/api/auth';

  constructor(protected override http: HttpClient) {
    super(http);
  }



  // ============================================================================
  // USER PROFILE ENDPOINTS
  // ============================================================================

  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<UserDto> {
    return this.http
      .get<UserDto>(`${this.baseUrl}/me`)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<UserDto>): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.baseUrl}/me`, updates).pipe(
      tap((updatedUser) => console.log('Profile updated:', updatedUser)),
      catchError(this.handleError)
    );
  }

  /**
   * Change password
   */
  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/me/change-password`, {
        currentPassword,
        newPassword,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update user address
   */
  updateAddress(address: AddressDto): Observable<UserDto> {
    return this.http
      .put<UserDto>(`${this.baseUrl}/me/address`, { address })
      .pipe(catchError(this.handleError));
  }

  // ============================================================================
  // USER ORDERS ENDPOINTS
  // ============================================================================

  /**
   * Get user orders
   */
  getOrders(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/me/orders`)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Get specific order
   */
  getOrder(orderId: number): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/me/orders/${orderId}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Cancel order
   */
  cancelOrder(orderId: number): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/me/orders/${orderId}/cancel`, {})
      .pipe(catchError(this.handleError));
  }

  // ============================================================================
  // USER WISHLIST ENDPOINTS
  // ============================================================================

  /**
   * Get user wishlist
   */
  getWishlist(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/me/wishlist`)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Add item to wishlist
   */
  addToWishlist(productId: number): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/me/wishlist`, { productId })
      .pipe(catchError(this.handleError));
  }

  /**
   * Remove item from wishlist
   */
  removeFromWishlist(productId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/me/wishlist/${productId}`)
      .pipe(catchError(this.handleError));
  }

  // ============================================================================
  // USER REVIEWS ENDPOINTS
  // ============================================================================

  /**
   * Get user reviews
   */
  getReviews(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/me/reviews`)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Create product review
   */
  createReview(
    productId: number,
    review: {
      rating: number;
      comment: string;
    }
  ): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/me/reviews`, {
        productId,
        ...review,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update review
   */
  updateReview(
    reviewId: number,
    updates: {
      rating?: number;
      comment?: string;
    }
  ): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/me/reviews/${reviewId}`, updates)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete review
   */
  deleteReview(reviewId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/me/reviews/${reviewId}`)
      .pipe(catchError(this.handleError));
  }


}
