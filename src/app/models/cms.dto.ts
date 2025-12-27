export interface CmsProfileDto {
  id: number;
  profileName: string;
  isActive: boolean;

  websiteName: string;
  tagline?: string;
  logoBase64?: string;
  faviconBase64?: string;

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

  features: CmsFeature[];
  categories: CmsCategory[];

  lastUpdated: Date;
  createdAt: Date;
}

export interface CmsFeature {
  id: number;
  iconClass: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface CmsCategory {
  id: number;
  title: string;
  description: string;
  imageBase64?: string;
  itemCountText?: string;
  sortOrder: number;
}

export interface CmsStoredProfileDto {
  id: number;
  profileName: string;
  isActive: boolean;
  lastModified: Date;
  createdAt: Date;
}
