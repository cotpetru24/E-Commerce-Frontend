import { ProductDto } from './product.dto';

export interface CartItem {
  product: ProductDto;
  quantity: number;
  barcode: string;
}
