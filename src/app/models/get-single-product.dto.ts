import { AdditionalProductImageDto } from "./additional-product-image.dto";
import { ProductDto } from "./product.dto";

export interface GetSingleProductDto {
    product:ProductDto | null,
    relatedProducts:ProductDto [],
    additionalImages:AdditionalProductImageDto[]
}