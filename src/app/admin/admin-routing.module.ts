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
    loadComponent: () => import('./add-product/add-product.component').then(m => m.AddProductComponent) 
  },
  { 
    path: 'edit-product/:id', 
    loadComponent: () => import('./edit-product/edit-product.component').then(m => m.EditProductComponent) 
  },
  { 
    path: 'orders', 
    loadComponent: () => import('./order-management/order-management.component').then(m => m.OrderManagementComponent) 
  },
  { 
    path: 'orders/:id', 
    loadComponent: () => import('./view-order/view-order.component').then(m => m.ViewOrderComponent) 
  },
  { 
    path: 'users', 
    loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent) 
  },
  { 
    path: 'content-management', 
    loadComponent: () => import('./content-management/content-management.component').then(m => m.ContentManagementComponent) 
  },
  { 
    path: 'barcode-scanner', 
    loadComponent: () => import('./barcode-scanner/barcode-scanner.component').then(m => m.BarcodeScannerComponent) 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
