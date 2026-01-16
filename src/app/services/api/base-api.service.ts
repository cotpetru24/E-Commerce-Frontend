import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export abstract class BaseApiService {
  protected readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(protected http: HttpClient) {}

  protected get<TResponse>(
    url: string,
    options: { params?: HttpParams } = {}
  ): Observable<TResponse> {
    return this.http.get<TResponse>(url, options);
  }

  protected post<TResponse, TBody = any>(
    url: string,
    body: TBody
  ): Observable<TResponse> {
    return this.http.post<TResponse>(url, body);
  }

  protected put<TResponse, TBody = any>(
    url: string,
    body: TBody
  ): Observable<TResponse> {
    return this.http.put<TResponse>(url, body);
  }

  protected patch<TResponse, TBody = any>(
    url: string,
    body: TBody
  ): Observable<TResponse> {
    return this.http.patch<TResponse>(url, body);
  }

  protected delete<TResponse>(url: string): Observable<TResponse> {
    return this.http.delete<TResponse>(url);
  }

  protected buildUrl(endpoint: string): string {
    return `${this.apiBaseUrl}${endpoint}`;
  }

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
}
