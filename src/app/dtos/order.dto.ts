import { AddressDto, PaymentDto, CreateAddressRequestDto } from '.';

export interface OrderDto {
  id: number;
  userId?: string;
  orderStatusId?: number;
  orderStatusName?: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
  payment: PaymentDto;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  orderItems: OrderItemDto[];
}

export interface AdminOrderDto {
  id: number;
  userId: string;
  userEmail: string;
  userName: string;
  orderStatusName?: string;
  orderStatusCode: OrderStatusEnum;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  shippingAddress?: AddressDto;
  billingAddress?: AddressDto;
  orderItems: OrderItemDto[];
  payment: PaymentDto;
}

export interface OrderItemDto {
  id: number;
  orderId?: number;
  productId?: number;
  productName: string;
  productPrice: number;
  quantity: number;
  size?: string;
  createdAt?: Date;
  mainImage?: string;
  brandName?: string;
  barcode: string;
}

export interface OrderSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface GetUserOrdersRequestDto {
  pageNumber: number;
  pageSize: number;
  statusFilter?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface GetUserOrdersResponseDto {
  orders: OrderDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetAllOrdersRequestDto {
  orderStatus?: OrderStatusEnum | null;
  pageNumber?: number | null;
  pageSize?: number | null;
  fromDate?: Date | null;
  toDate?: Date | null;
  sortBy?: SortBy | null;
  sortDirection?: SortDirection | null;
  searchTerm?: string | null;
}

export interface GetAllOrdersResponseDto {
  orders: AdminOrderDto[];
  totalQueryCount: number;
  adminOrdersStats: AdminOrdersStatsDto;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PlaceOrderRequestDto {
  orderItems: OrderItemRequestDto[];
  shippingAddressId: number;
  billingAddressId: number | null;
  billingAddressSameAsShipping: boolean;
  billingAddressRequest: CreateAddressRequestDto | null;
  shippingCost: number;
  discount: number;
  notes: string | null;
  paymentIntentId: string;
}

export interface OrderItemRequestDto {
  productId: number;
  quantity: number;
  productSizeBarcode: string;
}

export interface PlaceOrderResponseDto {
  orderId: number;
  message: string;
  total: number;
  createdAt: Date;
}

export interface UpdateOrderStatusRequestDto {
  orderStatusId: OrderStatusEnum;
  notes?: string;
}

export enum OrderStatusEnum {
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
  PaymentFailed = 6,
  Returned = 7,
}

export enum SortBy {
  DateCreated,
  Total,
}

export enum SortDirection {
  Ascending,
  Descending,
}

export interface AdminOrdersStatsDto {
  totalOrdersCount: number;
  totalPendingOrdersCount: number;
  totalProcessingOrdersCount: number;
  totalDeliveredOrdersCount: number;
}
