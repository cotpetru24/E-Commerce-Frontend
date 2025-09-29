import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryMapService {
  private countryMap: { [key: string]: string } = {
    US: 'United States',
    CA: 'Canada',
    UK: 'United Kingdom',
    AU: 'Australia',
    DE: 'Germany',
    FR: 'France',
    JP: 'Japan',
    IT: 'Italy',
    ES: 'Spain',
    NL: 'Netherlands',
    SE: 'Sweden',
    NO: 'Norway',
    DK: 'Denmark',
    FI: 'Finland',
    CH: 'Switzerland',
    AT: 'Austria',
    BE: 'Belgium',
    IE: 'Ireland',
    NZ: 'New Zealand'
  };

  getName(code: string): string {
    return this.countryMap[code] ?? code;
  }

  getAll(): { code: string; name: string }[] {
    return Object.entries(this.countryMap).map(([code, name]) => ({ code, name }));
  }
}
