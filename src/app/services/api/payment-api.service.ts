import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';


@Injectable({
  providedIn: 'root',
})
export class PaymentApiService extends BaseApiService {

    protected readonly baseUrl = '/api/Payment';

  constructor(protected override http: HttpClient) {
    super(http);
  }


  createPaymentIntent(amount: number ): Observable<{ clientSecret: string }> {
    return this.post<{ clientSecret: string }>(
      this.buildUrl(this.baseUrl+'/createPaymentIntent'),

      amount
    );
  }

  storePaymentDetails(orderId: number, paymentIntentId: string): Observable<void> {
    const body = { orderId, paymentIntentId };
    return this.post<void, { orderId: number; paymentIntentId: string }>
    (this.buildUrl(`${this.baseUrl}/storePaymentDetails`), body);
  }

}
