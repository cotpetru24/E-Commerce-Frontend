import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products' },
  { path: 'auth', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
  { path: 'products', loadChildren: () => import('./products/products-module').then(m => m.ProductsModule) },
  { path: 'cart', loadChildren: () => import('./cart/cart-module').then(m => m.CartModule) },
  { path: 'checkout', loadChildren: () => import('./checkout/checkout-module').then(m => m.CheckoutModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule) }
  // Lazy-loaded modules like `auth` will be added here automatically
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
