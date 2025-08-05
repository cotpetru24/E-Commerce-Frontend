export interface ProductFilterDto {
  Gender?: string | null;
  Brand?: string | null;
  MinPrice?: number | null;
  MaxPrice?: number | null;
  SearchTerm?: string | null;
  Page?: number | null;
  PageSize?: number | null;
}
