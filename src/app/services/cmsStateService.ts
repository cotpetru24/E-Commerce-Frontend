import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CmsStateService {
  private cmsProfileSubject = new BehaviorSubject<any>(null);
  cmsProfile$ = this.cmsProfileSubject.asObservable();

  setProfile(profile: any) {
    this.cmsProfileSubject.next(profile);
  }
}
