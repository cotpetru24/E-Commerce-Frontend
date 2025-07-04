import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { ProductDto } from '../../models/product.dto';

// ============================================================================
// PRODUCT API SERVICE
// ============================================================================
// This service handles all product-related API calls
// Best practice: One service per domain/feature

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  // Base URL for product endpoints
  private readonly baseUrl = '/api/products';
  
  constructor(private http: HttpClient) {}

  // ============================================================================
  // GET REQUESTS - FETCHING DATA
  // ============================================================================

  /**
   * Get all products with optional filtering
   */
  getProducts(params?: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<ProductDto[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof typeof params];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ProductDto[]>(this.baseUrl, { params: httpParams }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Get a single product by ID
   */
  getProductById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.baseUrl}/${id}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.baseUrl}/category/${category}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Get products by brand
   */
  getProductsByBrand(brand: string): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.baseUrl}/brand/${brand}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Search products by name or description
   */
  searchProducts(query: string): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.baseUrl}/search`, {
      params: { q: query }
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.baseUrl}/featured`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  /**
   * Get related products
   */
  getRelatedProducts(productId: number): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.baseUrl}/${productId}/related`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // POST REQUESTS - CREATING DATA
  // ============================================================================

  /**
   * Create a new product (Admin only)
   */
  createProduct(product: Omit<ProductDto, 'id'>): Observable<ProductDto> {
    return this.http.post<ProductDto>(this.baseUrl, product).pipe(
      tap(newProduct => console.log('Product created:', newProduct)),
      catchError(this.handleError)
    );
  }

  /**
   * Add product to wishlist
   */
  addToWishlist(productId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${productId}/wishlist`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // PUT/PATCH REQUESTS - UPDATING DATA
  // ============================================================================

  /**
   * Update a product (Admin only)
   */
  updateProduct(id: number, product: Partial<ProductDto>): Observable<ProductDto> {
    return this.http.put<ProductDto>(`${this.baseUrl}/${id}`, product).pipe(
      tap(updatedProduct => console.log('Product updated:', updatedProduct)),
      catchError(this.handleError)
    );
  }

  /**
   * Update product stock
   */
  updateProductStock(id: number, stock: number): Observable<ProductDto> {
    return this.http.patch<ProductDto>(`${this.baseUrl}/${id}/stock`, { stock }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update product price
   */
  updateProductPrice(id: number, price: number): Observable<ProductDto> {
    return this.http.patch<ProductDto>(`${this.baseUrl}/${id}/price`, { price }).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // DELETE REQUESTS - REMOVING DATA
  // ============================================================================

  /**
   * Delete a product (Admin only)
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => console.log('Product deleted:', id)),
      catchError(this.handleError)
    );
  }

  /**
   * Remove product from wishlist
   */
  removeFromWishlist(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}/wishlist`).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get available categories
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get available brands
   */
  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/brands`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get product statistics
   */
  getProductStats(): Observable<{
    totalProducts: number;
    categories: number;
    brands: number;
    lowStock: number;
  }> {
    return this.http.get<any>(`${this.baseUrl}/stats`).pipe(
      catchError(this.handleError)
    );
  }

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    
    console.error('Product API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 