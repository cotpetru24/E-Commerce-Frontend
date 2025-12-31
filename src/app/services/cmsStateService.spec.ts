import { TestBed } from '@angular/core/testing';
import { CmsStateService } from './cmsStateService';

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
    const mockProfile = {
      websiteName: 'Test Store',
      tagline: 'Test Tagline',
      navbarBgColor: '#1a1a1a',
      navbarTextColor: '#ffffff'
    };

    let emittedProfile: any = null;
    service.cmsProfile$.subscribe(profile => {
      emittedProfile = profile;
    });

    service.setProfile(mockProfile);

    expect(emittedProfile).toEqual(mockProfile);
  });

  it('setProfile_ShouldEmitNull_WhenNullProfileIsSet', () => {
    let emittedProfile: any = undefined;
    service.cmsProfile$.subscribe(profile => {
      emittedProfile = profile;
    });

    service.setProfile(null);

    expect(emittedProfile).toBeNull();
  });
});
