import { ProductDto } from "@dtos/product.dto";

export interface CartItem {
  product: ProductDto;
  quantity: number;
  size: number;
  barcode: string;
}
