import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  newsletterEmail: string = '';
  showBackToTop: boolean = false;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showBackToTop = window.scrollY > 300;
  }

  subscribeNewsletter() {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      // In a real app, this would call a service to subscribe
      this.snackBar.open('Thank you for subscribing to our newsletter!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      this.newsletterEmail = '';
    } else {
      this.snackBar.open('Please enter a valid email address', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Modal handlers - in a real app, these would open actual modals
  openContactModal() {
    this.snackBar.open('Contact modal would open here', 'Close', { duration: 2000 });
  }

  openHelpModal() {
    this.snackBar.open('Help & FAQ modal would open here', 'Close', { duration: 2000 });
  }

  openShippingModal() {
    this.snackBar.open('Shipping information modal would open here', 'Close', { duration: 2000 });
  }

  openReturnsModal() {
    this.snackBar.open('Returns & exchanges modal would open here', 'Close', { duration: 2000 });
  }

  openSizeGuideModal() {
    this.snackBar.open('Size guide modal would open here', 'Close', { duration: 2000 });
  }

  openTrackOrderModal() {
    this.snackBar.open('Track order modal would open here', 'Close', { duration: 2000 });
  }

  openAboutModal() {
    this.snackBar.open('About us modal would open here', 'Close', { duration: 2000 });
  }

  openCareersModal() {
    this.snackBar.open('Careers modal would open here', 'Close', { duration: 2000 });
  }

  openPressModal() {
    this.snackBar.open('Press modal would open here', 'Close', { duration: 2000 });
  }

  openPartnersModal() {
    this.snackBar.open('Partners modal would open here', 'Close', { duration: 2000 });
  }

  openSustainabilityModal() {
    this.snackBar.open('Sustainability modal would open here', 'Close', { duration: 2000 });
  }

  openPrivacyModal() {
    this.snackBar.open('Privacy policy modal would open here', 'Close', { duration: 2000 });
  }

  openTermsModal() {
    this.snackBar.open('Terms of service modal would open here', 'Close', { duration: 2000 });
  }

  openCookiesModal() {
    this.snackBar.open('Cookie policy modal would open here', 'Close', { duration: 2000 });
  }
}
