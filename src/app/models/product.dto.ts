// import { z } from 'zod';
import { Audience } from './audience.enum';
// import is from 'zod/v4/locales/is.cjs';

export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | undefined;
  imagePath: string;
  stock: number;
  audience: Audience;
  brandName: string;
  rating?: number | undefined;
  reviewCount?: number | undefined;
  sizes?: ProductSizeDto[] | undefined;
  productFeatures?: AdminProductFeatureDto[] | undefined;
  isNew?: boolean | undefined;
  discountPercentage?: number;
  selected?: boolean;
  isActive: boolean;
}

export interface AdminProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | undefined;
  imagePath: string;
  totalStock?: number;
  audience?: Audience;
  audienceId: number;
  brandName: string;
  brandId: number;
  rating?: number | undefined;
  reviewCount?: number | undefined;
  productSizes: ProductSizeDto[];
  productFeatures?: AdminProductFeatureDto[] | undefined;
  isNew?: boolean | undefined;
  discountPercentage?: number;
  selected?: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdminBrandDto {
  brandId: number;
  brandName: string;
}

export interface AdminProductAudienceDto {
  audienceId: number;
  audienceName: string;
}

export interface AdminProductFeatureDto {
  id: number;
  featureText: string;
  sortOrder: number;
}

export interface ProductSizeDto {
  id?: number;
  size: number;
  stock: number;
  barcode: string;
  sku?: string;
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

export interface AdminProductsStatsDto {
  totalProductsCount: number;
  totalLowStockProductsCount: number;
  totalOutOfStockProductsCount: number;
  totalActiveProductsCount: number;
}

// const ProductDtoSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   description: z.string(),
//   price: z.number(),
//   originalPrice: z.number().optional(),
//   imagePath: z.string(),
//   stock: z.number(),
//   audience: z.nativeEnum(Audience),
//   brandName: z.string(),
//   rating: z.number().optional(),
//   reviewCount: z.number().optional(),
//   sizes: z.array(z.string()).optional(),
//   isNew: z.boolean().optional(),
//   discountPercentage: z.number().optional(),
//   isActive: z.boolean(),
// });

// type ProductDtoValidated = z.infer<typeof ProductDtoSchema>

// export type { ProductDto, ProductDtoValidated };

// export{ProductDtoSchema}

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
