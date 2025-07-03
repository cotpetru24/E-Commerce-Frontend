import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Checkout } from './checkout';

const routes: Routes = [{ path: '', component: Checkout }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
