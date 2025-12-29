import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';
import { CmsStateService } from '../../services/cmsStateService';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  newsletterEmail: string = '';
  showBackToTop: boolean = false;
  websiteName = '';
private sub!: Subscription;

  constructor(
    private toastService: ToastService,
    private cmsStateService: CmsStateService
  ) {}

  ngOnInit() {
    this.sub = this.cmsStateService.cmsProfile$.subscribe((profile) => {
      if (!profile) return;
      this.websiteName = profile.websiteName;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showBackToTop = window.scrollY > 300;
  }

  subscribeNewsletter() {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      // In a real app, this would call a service to subscribe
      this.toastService.success('Thank you for subscribing to our newsletter!');
      this.newsletterEmail = '';
    } else {
      this.toastService.error('Please enter a valid email address');
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
    this.toastService.info('Contact modal would open here');
  }

  openHelpModal() {
    this.toastService.info('Help & FAQ modal would open here');
  }

  openShippingModal() {
    this.toastService.info('Shipping information modal would open here');
  }

  openReturnsModal() {
    this.toastService.info('Returns & exchanges modal would open here');
  }

  openSizeGuideModal() {
    this.toastService.info('Size guide modal would open here');
  }

  openTrackOrderModal() {
    this.toastService.info('Track order modal would open here');
  }

  openAboutModal() {
    this.toastService.info('About us modal would open here');
  }

  openCareersModal() {
    this.toastService.info('Careers modal would open here');
  }

  openPressModal() {
    this.toastService.info('Press modal would open here');
  }

  openPartnersModal() {
    this.toastService.info('Partners modal would open here');
  }

  openSustainabilityModal() {
    this.toastService.info('Sustainability modal would open here');
  }

  openPrivacyModal() {
    this.toastService.info('Privacy policy modal would open here');
  }

  openTermsModal() {
    this.toastService.info('Terms of service modal would open here');
  }

  openCookiesModal() {
    this.toastService.info('Cookie policy modal would open here');
  }
}
