import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';

import { AddressForm } from './address-form/address-form.component';
import { CheckoutReview } from './checkout-review/checkout-review.component';
import { PaymentMethod } from './payment-method/payment-method.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    AddressForm,
    CheckoutReview,
    PaymentMethod,
  ]
})
export class CheckoutModule { }
