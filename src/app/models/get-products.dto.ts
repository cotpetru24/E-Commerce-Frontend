import { ProductDto } from "./product.dto";

export interface GetProductsDto{
    products: ProductDto[],
    brands: string []
}

