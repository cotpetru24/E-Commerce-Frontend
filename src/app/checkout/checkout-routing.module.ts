import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddressForm } from './address-form/address-form.component';
import { PaymentMethod } from './payment-method/payment-method.component';
import { CheckoutReview } from './checkout-review/checkout-review.component';

const routes: Routes = [
  { path: 'addressForm', component: AddressForm },
  { path: 'checkout-review', component: CheckoutReview },
    { path: 'payment-method', component: PaymentMethod },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}
