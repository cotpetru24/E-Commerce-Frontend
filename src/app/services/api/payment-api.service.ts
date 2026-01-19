import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  CreatePaymentIntentRequestDto,
  CreatePaymentIntentResponseDto,
  StorePaymentRequestDto,
} from '@dtos';

@Injectable({
  providedIn: 'root',
})

export class PaymentApiService extends BaseApiService {
  private readonly paymentEndPoint = '/api/Payment';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  createPaymentIntent(
    request: CreatePaymentIntentRequestDto
  ): Observable<CreatePaymentIntentResponseDto> {
    return this.post<CreatePaymentIntentResponseDto>(
      this.buildUrl(this.paymentEndPoint + '/createPaymentIntent'),
      request
    );
  }

  storePaymentDetails(request: StorePaymentRequestDto): Observable<void> {
    return this.post<void, StorePaymentRequestDto>(
      this.buildUrl(`${this.paymentEndPoint}/storePaymentDetails`),
      request
    );
  }
}
