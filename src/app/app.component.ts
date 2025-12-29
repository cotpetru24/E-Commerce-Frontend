import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CmsApiService } from './services/api/cms-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ecommerce-app';

  constructor(private cmsService: CmsApiService) {}

  ngOnInit(): void {
    const cached = localStorage.getItem('cmsProfile');

    if (cached && cached != null) {
      const cms = JSON.parse(cached);
      this.applyTheme(cms);
    }

    this.cmsService.GetCmsNavAndFooterAsync().subscribe((cms) => {
      localStorage.setItem('cmsProfile', JSON.stringify(cms));
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
