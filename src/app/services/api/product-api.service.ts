import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  ProductFilterDto,
  GetProductByIdDto,
  GetProductsDto,
} from '@dtos';

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

  getProductById(id: number): Observable<GetProductByIdDto> {
    const url = this.buildUrl(`${this.productEndPoint}/${id}`);
    return this.get<GetProductByIdDto>(url);
  }

  getFeaturedProducts(): Observable<GetProductsDto> {
    const url = this.buildUrl(`${this.productEndPoint}/featured`);
    return this.get<GetProductsDto>(url);
  }
}
