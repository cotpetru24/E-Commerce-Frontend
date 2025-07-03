import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartSummaryComponent } from './cart-summary/cart-summary.component';
import { CartViewComponent } from './cart-view/cart-view.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CartRoutingModule,
    CartSummaryComponent,
    CartViewComponent,
  ]
})
export class CartModule { }
