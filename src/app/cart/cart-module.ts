import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing-module';
import { Cart } from './cart';


@NgModule({
  declarations: [
    Cart
  ],
  imports: [
    CommonModule,
    CartRoutingModule
  ]
})
export class CartModule { }
