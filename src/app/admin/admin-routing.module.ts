import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) 
  },
  { 
    path: 'products', 
    loadComponent: () => import('./product-management/product-management.component').then(m => m.ProductManagementComponent) 
  },
  { 
    path: 'add-product', 
    loadComponent: () => import('./add-product/add-product.component').then(m => m.AddProductComponet) 
  },
  { 
    path: 'edit-product/:id', 
    loadComponent: () => import('./edit-product/edit-product.component').then(m => m.EditProductComponent) 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
