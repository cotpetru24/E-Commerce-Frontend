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
      this.cmsStateService.applyTheme(cached);
      this.cmsStateService.setPageTitle(cached.websiteName);
    }

    this.cmsService.getCmsNavAndFooter().subscribe((cms) => {
      this.storageService.setLocalObject('cmsProfile', cms);
      this.cmsStateService.setProfile(cms);
      this.cmsStateService.applyTheme(cms);
      this.cmsStateService.setFavicon(cms.favicon);
      this.cmsStateService.setPageTitle(cms.websiteName);
    });
  }
}
