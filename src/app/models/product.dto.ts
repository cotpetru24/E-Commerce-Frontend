interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  category: 'men' | 'women' | 'children' | 'unisex';
  brand: string;
  rating?: number;
  reviewCount?: number;
  sizes?: string[];
  isNew?: boolean;
  discount?: number;
}

export type { ProductDto };
