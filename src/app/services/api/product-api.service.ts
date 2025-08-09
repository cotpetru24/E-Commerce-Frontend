import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProductDto } from '../../models/product.dto';
import { BaseApiService } from './base-api.service';
import { GetProductsDto } from '../../models/get-products.dto';
import { ProductFilterDto } from '../../models/product-filter.dto';
import { GetSingleProductDto } from '../../models/get-single-product.dto';

// ============================================================================
// PRODUCT API SERVICE
// ============================================================================
// This service handles all product-related API calls
// Best practice: One service per domain/feature

@Injectable({
  providedIn: 'root',
})
export class ProductApiService extends BaseApiService {
  // Base URL for product endpoints
  protected readonly baseUrl = '/api/product';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // ============================================================================
  // GET REQUESTS - FETCHING DATA
  // ============================================================================

  /**
   * Get all products with optional filtering
   */
  getProducts(params?: ProductFilterDto): Observable<GetProductsDto> {
    let httpParams = this.createParams(params || {});

    this.logRequest('GET', this.buildUrl('/api/product'), httpParams);

    return this.get<GetProductsDto>(this.buildUrl('/api/product'), {
      params: httpParams,
    });
  }

  /**
   * Get a single product by ID
   */
  getProductById(id: number): Observable<GetSingleProductDto> {

    const url = this.buildUrl(`/api/product/${id}`);

    this.logRequest('GET', url);

    return this.get<GetSingleProductDto>(url)
    .pipe(
      tap((response) => this.logResponse('GET', url, response))
    );
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<ProductDto[]> {
    return this.get<ProductDto[]>(this.buildUrl(`/category/${category}`))
  }

  /**
   * Get products by brand
   */
  getProductsByBrand(brand: string): Observable<ProductDto[]> {

    return this.get<ProductDto[]>(this.buildUrl(`/brand/${brand}`))
  }

  /**
   * Search products by name or description
   */
  searchProducts(query: string): Observable<ProductDto[]> {
    const params = this.createParams({ q: query });

    return this.get<ProductDto[]>(this.buildUrl(`/search`), {params})
  }



  /**
   * Get featured products
   */
  getFeaturedProducts(): Observable<ProductDto[]> {
    return this.get<ProductDto[]>( this.buildUrl(`/featured`))
  }


  /**
   * Get related products
   */
  getRelatedProducts(productId: number): Observable<ProductDto[]> {
    return this.get<ProductDto[]>(this.buildUrl(`${productId}/related`))
  }

  // ============================================================================
  // POST REQUESTS - CREATING DATA
  // ============================================================================


  /**
   * Create a new product (Admin only)
   */
  createProduct(product: Omit<ProductDto, 'id'>): Observable<ProductDto> {

    //check on server if jwt contains role = admin

    return this.post<ProductDto>(this.buildUrl(''), product).pipe(
      tap((newProduct) => console.log('Product created:', newProduct))
    );
  }

  /**
   * Add product to wishlist
   */
  addToWishlist(productId: number): Observable<void> {
    return this.post<void>(this.buildUrl(`${productId}/wishlist`), {})
  }

  // ============================================================================
  // PUT/PATCH REQUESTS - UPDATING DATA
  // ============================================================================

  /**
   * Update a product (Admin only)
   */
  updateProduct(
    id: number,
    product: Partial<ProductDto>
  ): Observable<ProductDto> {

    //check on server if jwt contains role = admin

    return this.put<ProductDto>(this.buildUrl(`${id}`), product).pipe(
      tap((updatedProduct) => console.log('Product updated:', updatedProduct)),
    );
  }

  /**
   * Update product stock
   */
  updateProductStock(id: number, stock: number): Observable<ProductDto> {

    //check on server if jwt contains role = admin

    return this.patch<ProductDto>(this.buildUrl(`${id}/stock`), { stock })
  }

  /**
   * Update product price
   */
  updateProductPrice(id: number, price: number): Observable<ProductDto> {

    //check on server if jwt contains role = admin

    return this.patch<ProductDto>(this.buildUrl(`${id}/price`), { price })
  }

  // ============================================================================
  // DELETE REQUESTS - REMOVING DATA
  // ============================================================================

  /**
   * Delete a product (Admin only)
   */
  deleteProduct(id: number): Observable<void> {

    //check on server if jwt contains role = admin

    return this.delete<void>((`${id}`)).pipe(
      tap(() => console.log('Product deleted:', id)));
  }

  /**
   * Remove product from wishlist
   */
  removeFromWishlist(productId: number): Observable<void> {

    //not sure if it needs to be delete => need to set up the db first

    return this.delete<void>(`${this.baseUrl}/${productId}/wishlist`)
      .pipe(catchError(this.handleError));
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get available categories
   */
  getCategories(): Observable<string[]> {
    return this.get<string[]>(this.buildUrl(`/categories`))
  }

  /**
   * Get available brands
   */
  getBrands(): Observable<string[]> {
    return this.get<string[]>((`/brands`))
  }

  /**
   * Get product statistics
   */
  getProductStats(): Observable<{

    //change this to productStatsDto

    totalProducts: number;
    categories: number;
    brands: number;
    lowStock: number;
  }> {
    return this.get<any>(this.buildUrl(`/stats`))
  }
}
