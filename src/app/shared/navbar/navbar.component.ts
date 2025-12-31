import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { AuthApiService } from '../../services/auth-api.service';
import { CmsStateService } from '../../services/cmsStateService';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isSmallScreen = false;
  showShopDropdown = false;
  showAccountDropdown = false;
  cartItemCount = 0;
  websiteName = '';
  websiteLogo?: String | null = null;
  showLogo: boolean = false;
  private sub!: Subscription;
  private cartSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private authApiService: AuthApiService,
    private cmsStateService: CmsStateService
  ) {
    // Check screen size on initialization
    this.checkScreenSize();
    // Listen for window resize events
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  ngOnInit() {
    this.cartSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });

    this.sub = this.cmsStateService.cmsProfile$.subscribe((profile) => {
      if (!profile) return;
      this.websiteName = profile.websiteName;
      this.websiteLogo = profile.websiteLogo;
      this.showLogo = profile.showLogo;
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }

    this.sub?.unsubscribe();

    window.removeEventListener('resize', () => this.checkScreenSize());
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 992; // Bootstrap lg breakpoint
  }

  toggleMobileMenu() {
    // Bootstrap handles the toggle automatically via data-bs-toggle
  }

  closeMobileMenu() {
    // Close the offcanvas menu
    const offcanvas = document.getElementById('mobileMenu');
    if (offcanvas) {
      const bsOffcanvas = new (window as any).bootstrap.Offcanvas(offcanvas);
      bsOffcanvas.hide();
    }
  }
  logout() {
    try {
      this.authApiService.logout();
    } catch (err) {
      this.toastService.error('Failed to logout');
    }
  }

  isAdmin(): boolean {
    return this.authApiService.isAdmin();
  }

  isLoggedIn(): boolean {
    return this.authApiService.isLoggedIn();
  }
}
