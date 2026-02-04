import {
  AdminProductsSortByEnum,
  AdminProductStockStatusEnum,
  AudienceEnum,
  ProductSortByOption,
  SortDirectionEnum,
} from './enums';

export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  totalStock: number;
  audience: AudienceEnum;
  brandName: string;
  rating: number | null;
  reviewCount: number | null;
  productSizes: ProductSizeDto[] | null;
  productFeatures: ProductFeatureDto[];
  productImages: ProductImageDto[];
  isNew: boolean | null;
  discountPercentage?: number | null;
  selected: boolean | null;
  isActive: boolean;
}

export interface AdminProductDto {
  id: number;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  totalStock: number;
  brandId: number | null;
  brandName: string | null;
  audience: AudienceEnum | null;
  rating: number | null;
  reviewCount: number | null;
  productSizes: ProductSizeDto[];
  productFeatures: ProductFeatureDto[];
  productImages: ProductImageDto[];
  isNew: boolean | null;
  discountPercentage: number | null;
  selected: boolean | null;
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ProductFeatureDto {
  id: number;
  featureText: string;
  sortOrder: number;
}

export interface ProductSizeDto {
  id: number | null;
  size: number;
  stock: number;
  sku: string | null;
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
  pageNumber: number | null;
  pageSize: number | null;
  searchTerm: string | null;
  isActive: boolean | null;
  productCategory: AudienceEnum | null;
  productBrand: string | null;
  productStockStatus: AdminProductStockStatusEnum | null;
  sortDirection: SortDirectionEnum | null;
  sortBy: AdminProductsSortByEnum | null;
}

export interface ProductAudienceDto {
  audienceId: number;
  audienceName: string;
}

export interface ProductFilterDto {
  Audience: AudienceEnum | null;
  Brand: string | null;
  MinPrice: number | null;
  MaxPrice: number | null;
  SearchTerm: string | null;
  Page: number | null;
  PageSize: number | null;
  SortBy: ProductSortByOption | null;
  Size: number | null;
}
