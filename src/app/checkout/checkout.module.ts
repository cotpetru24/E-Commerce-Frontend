import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { AddressFormComponent } from './address-form/address-form.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    AddressFormComponent,
    CheckoutReviewComponent,
    PaymentMethodComponent,
  ]
})
export class CheckoutModule { }
