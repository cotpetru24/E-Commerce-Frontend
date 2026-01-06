import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CmsNavAndFooterDto, CmsProfileDto } from "../models/cms.dto";

@Injectable({ providedIn: 'root' })
export class CmsStateService {
  private cmsProfileSubject = new BehaviorSubject<CmsProfileDto | null>(null);
  cmsProfile$ = this.cmsProfileSubject.asObservable();

  setProfile(profile: CmsProfileDto | null) {
    this.cmsProfileSubject.next(profile);
  }
    setPageTitle(websiteName: string): void {
    if (websiteName) {
      document.title = websiteName;
    } else {
      document.title = 'EcommerceApp';
    }
  }

  setFavicon(base64Icon: string): void {
    if (!base64Icon) return;

    const favicon =
      document.querySelector<HTMLLinkElement>("link[rel*='icon']");

    if (!favicon) return;

    favicon.type = 'image/png';
    favicon.href = base64Icon.startsWith('data:')
      ? base64Icon
      : `data:image/png;base64,${base64Icon}`;
  }

  applyTheme(cms: CmsNavAndFooterDto): void {
    const root = document.documentElement;

    root.style.setProperty('--navbar-bg-color', cms.navbarBgColor);
    root.style.setProperty('--navbar-link-color', cms.navbarLinkColor);
    root.style.setProperty('--navbar-text-color', cms.navbarTextColor);

    root.style.setProperty('--footer-bg-color', cms.footerBgColor);
    root.style.setProperty('--footer-link-color', cms.footerLinkColor);
    root.style.setProperty('--footer-text-color', cms.footerTextColor);
  }
}
