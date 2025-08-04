import { RouterModule, Routes } from "@angular/router";
import { UserAccountComponent } from "./user-account/user-account.component";
import { UserOrdersComponent } from "./user-orders/user-orders.component";
import { NgModule } from "@angular/core";



const routes : Routes=[
    {path: '', component: UserAccountComponent},
    {path:'orders', component: UserOrdersComponent}
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class UserRoutingModule{}