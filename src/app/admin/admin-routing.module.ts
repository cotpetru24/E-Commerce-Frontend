import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddProductComponet } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductManagementComponent } from './product-management/product-management.component';



const routes: Routes = [
  { path: '', component: ProductManagementComponent },
  {path: 'add-product', component: AddProductComponet },
  {path: 'edit-product/:id', component: EditProductComponent }, // assuming product has ID
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
