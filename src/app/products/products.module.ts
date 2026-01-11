import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    ProductListComponent,
    ProductCardComponent,
    ProductDetailsComponent,
  ],
})

export class ProductsModule {}
