import { z } from 'zod';
import { TargetAudience } from "./gender.enum";

interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | undefined;
  imagePath: string;
  stock: number;
  audience: TargetAudience
  brandName: string;
  rating?: number | undefined;
  reviewCount?: number | undefined;
  sizes?: string[] | undefined;
  isNew?: boolean | undefined;
  discount?: number;
}

const ProductDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  imagePath: z.string(),
  stock: z.number(),
  audience: z.nativeEnum(TargetAudience),
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
