import { RouterModule, Routes } from "@angular/router";
import { UserAccountComponent } from "./user-account/user-account.component";
import { UserOrdersComponent } from "./user-orders/user-orders.component";
import { UserOrderComponent } from "./user-order/user-order.component";
import { NgModule } from "@angular/core";

const routes : Routes=[
    {path: '', component: UserAccountComponent},
    // {path: 'order/:id', component: UserOrderComponent},
    { path: 'order/:id', loadComponent: () => import('./user-order/user-order.component').then(m => m.UserOrderComponent) },
    {path:'orders', component: UserOrdersComponent}

];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class UserRoutingModule{}