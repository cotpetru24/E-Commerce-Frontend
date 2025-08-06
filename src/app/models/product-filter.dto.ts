import { Audience } from "./audience.enum";

export interface ProductFilterDto {
  Audience?: Audience | null;
  Brand?: string | null;
  MinPrice?: number | null;
  MaxPrice?: number | null;
  SearchTerm?: string | null;
  Page?: number | null;
  PageSize?: number | null;
  SortBy?: SortByOption;
}

export enum SortByOption {
  NameAsc = 'NameAsc',
  NameDesc = 'NameDesc',
  PriceAsc = 'PriceAsc',
  PriceDesc = 'PriceDesc',
  BrandAsc = 'BrandAsc',
  BrandDesc = 'BrandDesc'
}

