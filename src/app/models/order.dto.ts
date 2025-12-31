// ============================================================================
// ORDER DTOs
// ============================================================================
// These interfaces match the backend Order DTOs

import { Order } from '../services/api/admin-api.service';
import { PaymentDto } from './payment.dto';
import {
  BillingAddressDto,
  CreateBillingAddressRequestDto,
  ShippingAddressDto,
} from './shipping-address.dto';

export interface OrderItemDto {
  id: number;
  orderId?: number;
  productId?: number;
  productName: string;
  productPrice: number;
  quantity: number;
  size?: string;
  createdAt?: Date;
  imagePath?: string;
  brandName?: string;
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
  shippingAddress: ShippingAddressDto;
  billingAddress: BillingAddressDto;
  payment?: PaymentDto;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  orderItems: OrderItemDto[];
}

export interface PlaceOrderRequestDto {
  orderItems: OrderItemRequestDto[];
  shippingAddressId: number;
  // billingAddressId: number;
  billingAddressSameAsShipping: boolean;
  billingAddress: CreateBillingAddressRequestDto | null;
  shippingCost: number;
  discount: number;
  notes?: string;
}

export interface OrderItemRequestDto {
  productId: number;
  quantity: number;
  size?: number;
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

export interface GetAllOrdersRequestDto {
  orderStatus?: OrderStatus | null;
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

export interface AdminOrdersStatsDto {
  totalOrdersCount: number;
  totalPendingOrdersCount: number;
  totalProcessingOrdersCount: number;
  totalDeliveredOrdersCount: number;
}

export enum SortBy {
  DateCreated,
  Total,
}

export enum SortDirection {
  Ascending,
  Descending,
}

// ============================================================================
// ADMIN ORDER DTOs
// ============================================================================
// Admin-specific order interfaces for enhanced order management

export interface AdminShippingAddressDto {
  id: number;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

export interface AdminBillingAddressDto {
  id: number;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

export interface AdminPaymentDto {
  id: number;
  paymentStatusName: string;
  transactionId?: string;
  createdAt?: Date;
  amount: number;
  currency?: string;
  cardBrand?: string;
  cardLast4?: string;
  billingName?: string;
  billingEmail?: string;
  paymentMethod?: string;
  receiptUrl?: string;
}

export interface AdminOrderDto {
  id: number;
  userId: string;
  userEmail: string;
  userName: string;
  orderStatusName?: string;
  orderStatusCode?: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  shippingAddress?: AdminShippingAddressDto;
  billingAddress?: AdminBillingAddressDto;
  orderItems: OrderItemDto[];
  payment: AdminPaymentDto;
}

export enum OrderStatus {
  pending = 1,
  processing = 2,
  shipped = 3,
  delivered = 4,
  cancelled = 5,
  refunded = 6,
  returned = 7,
}

export interface UpdateOrderStatusRequestDto {
  orderStatusId: OrderStatus;
  notes?: string;
}
