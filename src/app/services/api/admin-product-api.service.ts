import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { StorageService } from '../storage.service';
import {
  AdminProductDto,
  AdminBrandDto,
  AdminProductAudienceDto,
  GetProductsAdminRequestDto,
  GetProductsAdminResponseDto,
} from '../../models/product.dto';

// Type alias for response DTO
type AdminProductListDto = GetProductsAdminResponseDto;

// ============================================================================
// ADMIN PRODUCT API SERVICE
// ============================================================================
// Handles admin product management API calls

@Injectable({
  providedIn: 'root',
})
export class AdminProductApiService extends BaseApiService {
  private readonly endPoint = '/api/admin/products';

  constructor(
    protected override http: HttpClient,
    protected override storageService: StorageService
  ) {
    super(http, storageService);
  }

  /**
   * Get all products with admin details
   */
  getProducts(
    request: GetProductsAdminRequestDto | null
  ): Observable<AdminProductListDto> {
    const url = this.buildUrl(this.endPoint);
    const params = this.createParams({
      pageNumber: request?.pageNumber || 1,
      pageSize: request?.pageSize || 10,
      ...(request?.searchTerm && { searchTerm: request.searchTerm }),
      ...(request?.productBrand && { productBrand: request.productBrand }),
      ...(request?.isActive !== null &&
        request?.isActive !== undefined &&
        { isActive: request.isActive }),
      ...(request?.productStockStatus && {
        productStockStatus: request.productStockStatus,
      }),
      ...(request?.sortBy && { sortBy: request.sortBy }),
      ...(request?.sortDirection && { sortDirection: request.sortDirection }),
      ...(request?.productCategory && {
        productCategory: request.productCategory,
      }),
    });

    this.logRequest('GET', url, params);

    return this.get<AdminProductListDto>(url, { params }).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Get product by ID
   */
  getProductById(productId: number): Observable<AdminProductDto> {
    const url = this.buildUrl(`${this.endPoint}/${productId}`);
    this.logRequest('GET', url);

    return this.get<AdminProductDto>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Get product brands
   */
  getProductBrands(): Observable<AdminBrandDto[]> {
    const url = this.buildUrl(`${this.endPoint}/brands`);
    this.logRequest('GET', url);

    return this.get<AdminBrandDto[]>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Get product audience types
   */
  getProductAudience(): Observable<AdminProductAudienceDto[]> {
    const url = this.buildUrl(`${this.endPoint}/audience`);
    this.logRequest('GET', url);

    return this.get<AdminProductAudienceDto[]>(url).pipe(
      tap((response) => this.logResponse('GET', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Create new product
   */
  createProduct(product: AdminProductDto): Observable<AdminProductDto> {
    const url = this.buildUrl(this.endPoint);
    this.logRequest('POST', url, product);

    return this.post<AdminProductDto>(url, product).pipe(
      tap((response) => this.logResponse('POST', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update product
   */
  updateProduct(
    productId: number,
    product: AdminProductDto
  ): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/${productId}`);
    this.logRequest('PUT', url, product);

    return this.put<any>(url, product).pipe(
      tap((response) => this.logResponse('PUT', url, response)),
      catchError(this.handleError)
    );
  }

  /**
   * Delete product
   */
  deleteProduct(productId: number): Observable<any> {
    const url = this.buildUrl(`${this.endPoint}/${productId}`);
    this.logRequest('DELETE', url);

    return this.delete<any>(url).pipe(
      tap((response) => this.logResponse('DELETE', url, response)),
      catchError(this.handleError)
    );
  }
}
