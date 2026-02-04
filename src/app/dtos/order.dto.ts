import { AddressDto, PaymentDto, CreateAddressRequestDto } from '.';
import { OrdersSortByEnum, OrderStatusEnum, SortDirectionEnum } from './enums';

export interface OrderDto {
  id: number;
  userId: string | null;
  orderStatusId: number | null;
  orderStatusName: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: AddressDto;
  billingAddress: AddressDto;
  payment: PaymentDto;
  notes: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  orderItems: OrderItemDto[];
}

export interface AdminOrderDto {
  id: number;
  userId: string;
  userEmail: string;
  userName: string;
  status: OrderStatusEnum;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  shippingAddress: AddressDto | null;
  billingAddress: AddressDto | null;
  orderItems: OrderItemDto[];
  payment: PaymentDto;
}

export interface OrderItemDto {
  id: number;
  orderId: number | null;
  productId: number | null;
  productName: string;
  productPrice: number;
  quantity: number;
  size: string | null;
  createdAt: Date | null;
  mainImage: string | null;
  brandName: string | null;
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
  statusFilter: OrderStatusEnum | null;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface GetUserOrdersResponseDto {
  orders: OrderDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetAllOrdersRequestDto {
  orderStatus: OrderStatusEnum | null;
  pageNumber: number | null;
  pageSize: number | null;
  fromDate: Date | null;
  toDate: Date | null;
  sortBy: OrdersSortByEnum | null;
  sortDirection: SortDirectionEnum | null;
  searchTerm: string | null;
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
  notes: string | null;
}

export interface AdminOrdersStatsDto {
  totalOrdersCount: number;
  totalPendingOrdersCount: number;
  totalProcessingOrdersCount: number;
  totalDeliveredOrdersCount: number;
}
