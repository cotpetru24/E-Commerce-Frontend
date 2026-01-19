import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  AdminProductDto,
  BrandDto,
  ProductAudienceDto,
  GetProductsAdminRequestDto,
  GetProductsAdminResponseDto,
} from '@dtos';

@Injectable({
  providedIn: 'root',
})
export class AdminProductApiService extends BaseApiService {
  private readonly adminProductEndPoint = '/api/admin/products';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getProducts(
    request?: GetProductsAdminRequestDto,
  ): Observable<GetProductsAdminResponseDto> {
    const url = this.buildUrl(this.adminProductEndPoint);
    const params = this.createParams({
      pageNumber: request?.pageNumber || 1,
      pageSize: request?.pageSize || 10,
      ...(request?.searchTerm && { searchTerm: request.searchTerm }),
      ...(request?.productBrand && { productBrand: request.productBrand }),
      ...(request?.isActive !== null &&
        request?.isActive !== undefined && { isActive: request.isActive }),
      ...(request?.productStockStatus && {
        productStockStatus: request.productStockStatus,
      }),
      ...(request?.sortBy && { sortBy: request.sortBy }),
      ...(request?.sortDirection && { sortDirection: request.sortDirection }),
      ...(request?.productCategory && {
        productCategory: request.productCategory,
      }),
    });

    return this.get<GetProductsAdminResponseDto>(url, { params });
  }

  getProductById(productId: number): Observable<AdminProductDto> {
    const url = this.buildUrl(`${this.adminProductEndPoint}/${productId}`);
    return this.get<AdminProductDto>(url);
  }

  getProductBrands(): Observable<BrandDto[]> {
    const url = this.buildUrl(`${this.adminProductEndPoint}/brands`);
    return this.get<BrandDto[]>(url);
  }

  getProductAudience(): Observable<ProductAudienceDto[]> {
    const url = this.buildUrl(`${this.adminProductEndPoint}/audience`);
    return this.get<ProductAudienceDto[]>(url);
  }

  createProduct(product: AdminProductDto): Observable<AdminProductDto> {
    const url = this.buildUrl(this.adminProductEndPoint);
    return this.post<AdminProductDto>(url, product);
  }

  updateProduct(
    productId: number,
    product: AdminProductDto,
  ): Observable<{ message: string }> {
    const url = this.buildUrl(`${this.adminProductEndPoint}/${productId}`);
    return this.put<{ message: string }>(url, product);
  }

  deleteProduct(productId: number): Observable<{ message: string }> {
    const url = this.buildUrl(`${this.adminProductEndPoint}/${productId}`);
    return this.delete<{ message: string }>(url);
  }
}
