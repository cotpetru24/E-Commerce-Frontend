import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// ============================================================================
// BASE API SERVICE
// ============================================================================
// This service provides common functionality that all API services can use
// Other API services should extend this class

@Injectable({
  providedIn: 'root',
})
export abstract class BaseApiService {
  // Base URL for the API - should be configured in environment files
  protected readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(protected http: HttpClient) {}

  // ============================================================================
  // COMMON HTTP METHODS WITH ERROR HANDLING
  // ============================================================================

  /**
   * GET request with common error handling
   */
  protected get<T>(
    url: string,
    options: {
      params?: HttpParams;
      headers?: HttpHeaders;
    } = {}
  ): Observable<T> {
    // need to add the logic for the related products
    return this.http.get<T>(url, options).pipe(catchError(this.handleError));
  }

  /**
   * POST request with common error handling
   */
  protected post<T, B = any>(
    url: string,
    body: B,
    options: {
      headers?: HttpHeaders;
    } = {}
  ): Observable<T> {
    const headers = options.headers ?? this.getAuthHeaders();

    return this.http
      .post<T>(url, body, { ...options, headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * PUT request with common error handling
   */
  protected put<T, B = any>(
    url: string,
    body: B,
    options: {
      headers?: HttpHeaders;
    } = {}
  ): Observable<T> {
    const headers = options?.headers ?? this.getAuthHeaders();

    return this.http
      .put<T>(url, body, { ...options, headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * PATCH request with common error handling
   */
  protected patch<T>(
    url: string,
    body: any,
    options?: {
      headers?: HttpHeaders;
    }
  ): Observable<T> {
    const headers = options?.headers ?? this.getAuthHeaders();

    return this.http
      .patch<T>(url, body, { ...options, headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * DELETE request with common error handling
   */
  protected delete<T>(
    url: string,
    options?: {
      headers?: HttpHeaders;
    }
  ): Observable<T> {
    const headers = options?.headers ?? this.getAuthHeaders();

    return this.http
      .delete<T>(url, { ...options, headers })
      .pipe(catchError(this.handleError));
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Create HTTP headers with authentication token
   */
  protected getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }

  /**
   * Create HTTP params from object
   */
  protected createParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return httpParams;
  }

  /**
   * Build full URL with base URL
   */
  protected buildUrl(endpoint: string): string {
    return `${this.apiBaseUrl}${endpoint}`;
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  /**
   * Common error handler for all API services
   */
  protected handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error (network, etc.)
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      const status = error.status;
      const message = error.message;

      switch (status) {
        case 400:
          errorMessage = 'Bad Request - Invalid data provided';
          break;
        case 401:
          errorMessage = 'Unauthorized - Please log in again';
          // Could trigger logout here
          break;
        case 403:
          errorMessage = "Forbidden - You don't have permission";
          break;
        case 404:
          errorMessage = 'Not Found - Resource not available';
          break;
        case 409:
          errorMessage = 'Conflict - Resource already exists';
          break;
        case 422:
          errorMessage = 'Validation Error - Check your input';
          break;
        case 500:
          errorMessage = 'Server Error - Please try again later';
          break;
        default:
          errorMessage = `Server Error: ${status} - ${message}`;
      }
    }

    console.error('API Error:', {
      message: errorMessage,
      status: error.status,
      url: error.url,
      error: error.error,
    });

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Log API request for debugging
   */
  protected logRequest(method: string, url: string, data?: any): void {
    if (environment.production) return; // Only log in development

    console.log(`API ${method}:`, {
      url,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log API response for debugging
   */
  protected logResponse(method: string, url: string, data: any): void {
    if (environment.production) return; // Only log in development

    console.log(`API ${method} Response:`, {
      url,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}
