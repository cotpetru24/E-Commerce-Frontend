import { z } from 'zod';
import { Audience } from "./audience.enum";

interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | undefined;
  imagePath: string;
  stock: number;
  audience: Audience
  brandName: string;
  rating?: number | undefined;
  reviewCount?: number | undefined;
  sizes?: string[] | undefined;
  isNew?: boolean | undefined;
  discount?: number;
  selected?: boolean;
}


export interface GetProductsAdminResponseDto {
  products: ProductDto[];
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

sortDirection : ProductsSortDirection | null
sortBy?: ProductsSortBy | null;


}

export interface AdminProductsStatsDto{
totalProductsCount: number;
totalLowStockProductsCount: number;
totalOutOfStockProductsCount: number;
totalActiveProductsCount: number;
}



const ProductDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  imagePath: z.string(),
  stock: z.number(),
  audience: z.nativeEnum(Audience),
  brandName: z.string(),
  rating: z.number().optional(),
  reviewCount: z.number().optional(),
  sizes: z.array(z.string()).optional(),
  isNew: z.boolean().optional(),
  discountPercentage: z.number().optional(),
});


type ProductDtoValidated = z.infer<typeof ProductDtoSchema>

export type { ProductDto, ProductDtoValidated };

export{ProductDtoSchema}

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

