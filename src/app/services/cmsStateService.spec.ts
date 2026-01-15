import { TestBed } from '@angular/core/testing';
import { CmsStateService } from './cmsStateService';
import { CmsNavAndFooterDto } from '../models/cms.dto';

describe('CmsStateService', () => {
  let service: CmsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setProfile_ShouldEmitProfile_WhenProfileIsSet', () => {
    const mockProfile: CmsNavAndFooterDto = {
      websiteName: 'Test Store',
      navbarBgColor: '#1a1a1a',
      navbarTextColor: '#ffffff',
      navbarLinkColor: '#ff0000',
      footerBgColor: '#000000',
      footerTextColor: '#cccccc',
      footerLinkColor: '#00ff00',
      websiteLogo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
      showLogo: true,
      favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
    };

    let emittedProfile: any = null;

    service.cmsProfile$.subscribe((profile) => {
      emittedProfile = profile;
    });

    service.setProfile(mockProfile);
    expect(emittedProfile).toEqual(mockProfile);
  });

  it('setProfile_ShouldEmitNull_WhenNullProfileIsSet', () => {
    let emittedProfile: any = undefined;

    service.cmsProfile$.subscribe((profile) => {
      emittedProfile = profile;
    });

    service.setProfile(null);
    expect(emittedProfile).toBeNull();
  });
});
