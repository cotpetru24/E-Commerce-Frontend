import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartRoutingModule } from './cart-routing.module';
import { CartViewComponent } from './cart-view/cart-view.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CartRoutingModule,
    CartViewComponent,
  ],
})

export class CartModule {}
