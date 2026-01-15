import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export abstract class BaseApiService {
  protected readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(protected http: HttpClient) {}

  protected get<T>(
    url: string,
    options: { params?: HttpParams } = {}
  ): Observable<T> {
    return this.http.get<T>(url, options);
  }

  protected post<T, B = any>(url: string, body: B): Observable<T> {
    return this.http.post<T>(url, body);
  }

  protected put<T, B = any>(url: string, body: B): Observable<T> {
    return this.http.put<T>(url, body);
  }

  protected patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(url, body);
  }

  protected delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
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
