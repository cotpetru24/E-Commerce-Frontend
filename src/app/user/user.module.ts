import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserAccountComponent } from './user-account/user-account.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserAccountComponent,
    UserOrdersComponent,
    UserRoutingModule,
  ],
})
export class UserModule {}
