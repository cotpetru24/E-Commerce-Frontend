import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CmsApiService } from './services/api/cms-api.service';
import { CmsStateService } from './services/cmsStateService';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ecommerce-app';

  constructor(
    private cmsService: CmsApiService,
    private cmsStateService: CmsStateService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const cached = this.storageService.getLocalObject<any>('cmsProfile');

    if (cached) {
      this.cmsStateService.setProfile(cached);
      this.applyTheme(cached);
    }

    this.cmsService.GetCmsNavAndFooterAsync().subscribe((cms) => {
      this.storageService.setLocalObject('cmsProfile', cms);
      this.cmsStateService.setProfile(cms);
      this.applyTheme(cms);
    });
  }

  private applyTheme(cms: any): void {
    const root = document.documentElement;

    root.style.setProperty('--navbar-bg-color', cms.navbarBgColor);
    root.style.setProperty('--navbar-link-color', cms.navbarLinkColor);
    root.style.setProperty('--navbar-text-color', cms.navbarTextColor);

    root.style.setProperty('--footer-bg-color', cms.footerBgColor);
    root.style.setProperty('--footer-link-color', cms.footerLinkColor);
    root.style.setProperty('--footer-text-color', cms.footerTextColor);
  }
}
