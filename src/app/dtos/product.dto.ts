export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | undefined;
  totalStock: number;
  audience: Audience;
  brandName: string;
  rating?: number | undefined;
  reviewCount?: number | undefined;
  productSizes?: ProductSizeDto[] | undefined;
  productFeatures: ProductFeatureDto[];
  productImages: ProductImageDto[];
  isNew?: boolean | undefined;
  discountPercentage?: number;
  selected?: boolean;
  isActive: boolean;
}

export interface AdminProductDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number | undefined;
  totalStock: number;
  brandId?: number;
  brandName?: string;
  audienceId?: number;
  audience?: string;
  rating?: number | undefined;
  reviewCount?: number | undefined;
  productSizes: ProductSizeDto[];
  productFeatures: ProductFeatureDto[];
  productImages: ProductImageDto[];
  isNew?: boolean | undefined;
  discountPercentage?: number;
  selected?: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFeatureDto {
  id: number;
  featureText: string;
  sortOrder: number;
}

export interface ProductSizeDto {
  id: number;
  size: number;
  stock: number;
  sku?: string;
  barcode: string;
}

export interface ProductImageDto {
  id: number;
  productId: number;
  imagePath: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface BrandDto {
  brandId: number;
  brandName: string;
}

export interface AdminProductsStatsDto {
  totalProductsCount: number;
  totalLowStockProductsCount: number;
  totalOutOfStockProductsCount: number;
  totalActiveProductsCount: number;
}

export interface GetProductsDto {
  products: ProductDto[];
  brands: string[];
}
export interface GetProductByIdDto {
  product: ProductDto | null;
  relatedProducts: ProductDto[];
}

export interface GetProductsAdminResponseDto {
  products: AdminProductDto[];
  totalQueryCount: number;
  adminProductsStats: AdminProductsStatsDto;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  allBrands: string[];
}

export interface GetProductsAdminRequestDto {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string | null;
  isActive?: boolean | null;
  productCategory?: Audience | null;
  productBrand?: string | null;
  productStockStatus?: ProductStockStatus | null;
  sortDirection: ProductsSortDirection | null;
  sortBy?: ProductsSortBy | null;
}

export interface ProductAudienceDto {
  audienceId: number;
  audienceName: string;
}

export interface ProductFilterDto {
  Audience?: Audience | null;
  Brand?: string | null;
  MinPrice?: number | null;
  MaxPrice?: number | null;
  SearchTerm?: string | null;
  Page?: number | null;
  PageSize?: number | null;
  SortBy?: SortByOption | null;
  Size?: number | null;
}

export enum Audience {
  Men = 'men',
  Women = 'women',
  Children = 'children',
  Unisex = 'unisex',
}

export enum ProductsSortBy {
  DateCreated = 'createdAt',
  Name = 'name',
  Stock = 'stock',
}

export enum ProductsSortDirection {
  Ascending = 'asc',
  Descending = 'desc',
}

export enum ProductStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export enum ProductStockStatus {
  LowStock = 'low stock',
  HighStock = 'high stock',
  InStock = 'in stock',
  OutOfStock = 'out of stock',
}

export enum SortByOption {
  NameAsc = 'NameAsc',
  NameDesc = 'NameDesc',
  PriceAsc = 'PriceAsc',
  PriceDesc = 'PriceDesc',
  BrandAsc = 'BrandAsc',
  BrandDesc = 'BrandDesc',
}
