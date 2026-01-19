export interface CmsProfileDto {
  id: number;
  profileName: string;
  isActive: boolean;
  websiteName: string;
  tagline?: string;
  logoBase64?: string;
  faviconBase64?: string;
  showLogoInHeader?: boolean;
  navbarBgColor: string;
  navbarTextColor: string;
  navbarLinkColor: string;
  footerBgColor: string;
  footerTextColor: string;
  footerLinkColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroPrimaryButtonText: string;
  heroSecondaryButtonText: string;
  heroBackgroundImageBase64?: string;
  features: CmsFeatureDto[];
  categories: CmsCategoryDto[];
}

export interface CmsFeatureDto {
  id: number;
  iconClass: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface CmsCategoryDto {
  id: number;
  title: string;
  description: string;
  imageBase64?: string;
  itemTagline?: string;
  sortOrder: number;
}

export interface CmsStoredProfileDto {
  id: number;
  profileName: string;
  isActive: boolean;
  isDefault: boolean;
  lastModified: Date;
  createdAt: Date;
}

export interface CmsLandingPageDto {
  websiteName: string;
  tagline?: string;
  logoBase64?: string;
  faviconBase64?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroPrimaryButtonText: string;
  heroSecondaryButtonText: string;
  heroBackgroundImageBase64?: string;
  showLogoInHeader: boolean;
  features: CmsFeatureDto[];
  categories: CmsCategoryDto[];
}

export interface CmsNavAndFooterDto {
  navbarBgColor: string;
  navbarTextColor: string;
  navbarLinkColor: string;
  footerBgColor: string;
  footerTextColor: string;
  footerLinkColor: string;
  websiteName: string;
  websiteLogo: string;
  showLogo: boolean;
  favicon: string;
}
