import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductFiltersComponent } from './product-filters/product-filters.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ProductListComponent },
      { path: ':gender', component: ProductListComponent }, // default /products
      // default /products
    ],
  },
  { path: 'card', component: ProductCardComponent },
  { path: 'details/:id', component: ProductDetailsComponent }, // assuming product has ID
  { path: 'filters', component: ProductFiltersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
