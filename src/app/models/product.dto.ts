import { TargetAudience } from "./gender.enum";

interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  targetAudience: TargetAudience
  brand: string;
  rating?: number;
  reviewCount?: number;
  sizes?: string[];
  isNew?: boolean;
  discount?: number;
}

export type { ProductDto };
