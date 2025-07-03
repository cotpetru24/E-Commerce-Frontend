import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CartSummaryComponent } from './cart-summary/cart-summary.component';
import { CartViewComponent } from './cart-view/cart-view.component';

const routes: Routes = [
  { path: 'summary', component: CartSummaryComponent },
  {path: 'view', component: CartViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
