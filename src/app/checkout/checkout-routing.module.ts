import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddressFormComponent } from './address-form/address-form.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';

const routes: Routes = [
  { path: 'addressForm', component: AddressFormComponent },
  { path: 'checkout-review', component: CheckoutReviewComponent },
    { path: 'payment-method', component: PaymentMethodComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}
