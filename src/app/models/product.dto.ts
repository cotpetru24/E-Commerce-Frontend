interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: 'men' | 'women' | 'children';
  brand: string;
}

export type { ProductDto };
