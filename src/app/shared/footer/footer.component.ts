import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';
import { CmsStateService } from '../../services/cmsStateService';
import { UtilsService } from '../../services/utils';

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
  websiteLogo?: String | null = null;
  showLogo: boolean = false;

  private sub!: Subscription;

  constructor(
    private toastService: ToastService,
    private cmsStateService: CmsStateService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.sub = this.cmsStateService.cmsProfile$.subscribe((profile) => {
      if (!profile) return;
      this.websiteName = profile.websiteName;
      this.websiteLogo = profile.websiteLogo || null;
      this.showLogo = profile.showLogo || false;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showBackToTop = window.scrollY > 300;
  }

  scrollToTop() {
    this.utilsService.scrollToTop();
  }

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
