// ============================================================================
// ORDER DTOs
// ============================================================================
// These interfaces match the backend Order DTOs

export interface OrderItemDto {
  id: number;
  orderId?: number;
  productId?: number;
  productName: string;
  productPrice: number;
  quantity: number;
  size?: string;
  createdAt?: Date;
  imagePath: string;
  brandName: string;
}

export interface OrderDto {
  id: number;
  userId?: string;
  orderStatusId?: number;
  orderStatusName?: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddressId?: number;
  billingAddressId?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  orderItems: OrderItemDto[];
}

export interface PlaceOrderRequestDto {
  orderItems: OrderItemRequestDto[];
  shippingAddressId: number;
  billingAddressId: number;
  shippingCost: number;
  discount: number;
  notes?: string;
}

export interface OrderItemRequestDto {
  productId: number;
  quantity: number;
  size?: string;
}

export interface PlaceOrderResponseDto {
  orderId: number;
  message: string;
  total: number;
  createdAt: Date;
}

export interface GetOrdersRequestDto {
  page: number;
  pageSize: number;
  orderStatus?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface GetOrdersResponseDto {
  orders: OrderDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


