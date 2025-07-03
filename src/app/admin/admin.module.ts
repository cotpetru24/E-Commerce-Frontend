import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AddProductComponet } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductManagementComponent } from './product-management/product-management.component';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AddProductComponet,
    EditProductComponent,
    ProductManagementComponent
  ]
})
export class AdminModule { }
