import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./user-account/user-account.component').then(
        (m) => m.UserAccountComponent,
      ),
  },
  {
    path: 'order/:id',
    loadComponent: () =>
      import('./user-order/user-order.component').then(
        (m) => m.UserOrderComponent,
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./user-orders/user-orders.component').then(
        (m) => m.UserOrdersComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
