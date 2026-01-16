import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { GetProductsDto } from '../../models/get-products.dto';
import { ProductFilterDto } from '../../models/product-filter.dto';
import { GetSingleProductDto } from '../../models/get-single-product.dto';

@Injectable({
  providedIn: 'root',
})

export class ProductApiService extends BaseApiService {
  private readonly productEndPoint = '/api/product';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getProducts(filter: ProductFilterDto): Observable<GetProductsDto> {
    let params = this.createParams(filter);
    const url = this.buildUrl(this.productEndPoint);
    return this.get<GetProductsDto>(url, { params: params });
  }

  getProductById(id: number): Observable<GetSingleProductDto> {
    const url = this.buildUrl(`${this.productEndPoint}/${id}`);
    return this.get<GetSingleProductDto>(url);
  }

  getFeaturedProducts(): Observable<GetProductsDto> {
    const url = this.buildUrl(`${this.productEndPoint}/featured`);
    return this.get<GetProductsDto>(url);
  }
}
