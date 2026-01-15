import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { HttpClient } from '@angular/common/http';
import { CmsLandingPageDto, CmsNavAndFooterDto, CmsProfileDto, CmsStoredProfileDto } from '../../models/cms.dto';
import { Observable, tap } from 'rxjs';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class CmsApiService extends BaseApiService {
  protected readonly cmsEndpoint = '/api/Cms';

  constructor(protected override http: HttpClient, protected override storageService: StorageService) {
    super(http, storageService);
  }

  getCmsProfilesAsync(): Observable<CmsStoredProfileDto[]> {
    this.logRequest('GET', this.buildUrl(this.baseUrl + '/profiles'));

    return this.get(
      this.buildUrl(this.baseUrl + '/profiles')
    );
  }

  GetCmsNavAndFooterAsync(): Observable<CmsNavAndFooterDto> {
    const url = this.buildUrl(this.baseUrl + '/navAndFooter');
    this.logRequest('GET', url);

    return this.get<CmsNavAndFooterDto>(url).pipe(
      tap((response) => this.logResponse('GET', url, response))
    );
  }

  getCmsLandingPageAsync(): Observable<CmsLandingPageDto> {
    const url = this.buildUrl(this.baseUrl + '/landing');
    this.logRequest('GET', url);

    return this.get<CmsLandingPageDto>(url).pipe(
      tap((response) => this.logResponse('GET', url, response))
    );
  }


  getCmsActiveProfilesAsync(): Observable<CmsProfileDto> {
    const url = this.buildUrl(this.cmsEndpoint + '/active');

    return this.get<CmsProfileDto>(url);
  }







  getCmsProfileByIdAsync(profileId: number): Observable<CmsProfileDto> {
    const url = this.buildUrl(`${this.baseUrl}/${profileId}`);
    this.logRequest('GET', url, profileId);

    return this.get<CmsProfileDto>(url).pipe(
      tap((response) => this.logResponse('GET', url, response))
    );
  }

  createCmsProfileAsync(
    profileToCreate: CmsProfileDto
  ): Observable<CmsProfileDto> {
    const url = this.buildUrl(this.baseUrl);
    this.logRequest('POST', url, profileToCreate);

    return this.post<CmsProfileDto, CmsProfileDto>(url, profileToCreate).pipe(
      tap((response) => this.logResponse('POST', url, response))
    );
  }

  activateCmsProfileAsync(profileId: number): Observable<CmsProfileDto> {
    const url = this.buildUrl(`${this.baseUrl}/activate/${profileId}`);
    this.logRequest('POST', url, profileId);

    return this.post<CmsProfileDto, number>(url, profileId).pipe(
      tap((response) => this.logResponse('POST', url, response))
    );
  }

  updateCmsProfileAsync(
    profileToUpdate: CmsProfileDto
  ): Observable<CmsProfileDto> {
    const url = this.buildUrl(this.baseUrl);
    this.logRequest('PUT', url, profileToUpdate);
    return this.put<CmsProfileDto, CmsProfileDto>(url, profileToUpdate).pipe(
      tap((response) => this.logResponse('PUT', url, response))
    );
  }

  deleteCmsProfileAsync(profileId: number): Observable<boolean> {
    const url = this.buildUrl(`${this.baseUrl}/${profileId}`);
    this.logRequest('DELETE', url, profileId);

    return this.delete<boolean>(url).pipe(
      tap((response) => this.logResponse('DELETE', url, response))
    );
  }
}
