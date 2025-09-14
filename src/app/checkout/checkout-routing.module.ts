import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';
import { OrderConfirmedComponent } from './order-confirmed/order-confirmed.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';

const routes: Routes = [
  { path: '', component: ShippingAddressComponent, pathMatch: 'full' },
  { path: 'shipping-address', component: ShippingAddressComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'order-confirmed', component: OrderConfirmedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}
