import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import {
  CmsLandingPageDto,
  CmsNavAndFooterDto,
  CmsProfileDto,
  CmsStoredProfileDto,
} from '../../models/cms.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CmsApiService extends BaseApiService {
  protected readonly cmsEndpoint = '/api/Cms';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getCmsProfiles(): Observable<CmsStoredProfileDto[]> {
    const url = this.buildUrl(this.cmsEndpoint + '/profiles');
    return this.get<CmsStoredProfileDto[]>(url);
  }

  getCmsNavAndFooter(): Observable<CmsNavAndFooterDto> {
    const url = this.buildUrl(this.cmsEndpoint + '/navAndFooter');
    return this.get<CmsNavAndFooterDto>(url);
  }

  getCmsLandingPage(): Observable<CmsLandingPageDto> {
    const url = this.buildUrl(this.cmsEndpoint + '/landing');
    return this.get<CmsLandingPageDto>(url);
  }

  getCmsActiveProfiles(): Observable<CmsProfileDto> {
    const url = this.buildUrl(this.cmsEndpoint + '/active');
    return this.get<CmsProfileDto>(url);
  }

  getCmsProfileById(profileId: number): Observable<CmsProfileDto> {
    const url = this.buildUrl(`${this.cmsEndpoint}/${profileId}`);
    return this.get<CmsProfileDto>(url);
  }

  createCmsProfile(profileToCreate: CmsProfileDto): Observable<CmsProfileDto> {
    const url = this.buildUrl(this.cmsEndpoint);
    return this.post<CmsProfileDto, CmsProfileDto>(url, profileToCreate);
  }

  activateCmsProfile(profileId: number): Observable<CmsProfileDto> {
    const url = this.buildUrl(`${this.cmsEndpoint}/activate/${profileId}`);
    return this.post<CmsProfileDto>(url, undefined);
  }

  updateCmsProfile(profileToUpdate: CmsProfileDto): Observable<CmsProfileDto> {
    const url = this.buildUrl(this.cmsEndpoint);
    return this.put<CmsProfileDto, CmsProfileDto>(url, profileToUpdate);
  }

  deleteCmsProfile(profileId: number): Observable<boolean> {
    const url = this.buildUrl(`${this.cmsEndpoint}/${profileId}`);
    return this.delete<boolean>(url);
  }
}
