import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,

  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isSmallScreen = false;
  showShopDropdown = false;
  cartItemCount = 0;
  // @ViewChild(MatSidenav) drawer?: MatSidenav;
  
  private cartSubscription!: Subscription;

  constructor(
    // private breakpointObserver: BreakpointObserver,
    private cartService: CartService
  ) {
    // this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
    //   this.isSmallScreen = result.matches;
    // });
  }

  ngOnInit() {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  // toggleDrawer(){
  //   this.drawer?.toggle();
  // }

  // closeDrowerIfMobile() {
  //   if (this.isSmallScreen) {
  //     this.drawer?.close();
  //   }
  // }
}
