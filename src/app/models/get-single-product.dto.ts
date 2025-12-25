import { ProductImageDto } from "./product-image.dto";
import { ProductDto } from "./product.dto";

export interface GetSingleProductDto {
    product:ProductDto | null,
    relatedProducts:ProductDto [],
}