import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { AddressFormComponent } from './address-form/address-form.component';

const routes: Routes = [
  { path: '', component: AddressFormComponent, pathMatch: 'full' },
  { path: 'addressForm', component: AddressFormComponent },
  { path: 'payment-method', component: PaymentMethodComponent },
  { path: 'checkout-review', component: CheckoutReviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}
