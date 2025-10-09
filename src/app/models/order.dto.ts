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
  shippingAddress: ShippingAddressDto;
  billingAddress: BillingAddressDto;
  payment: PaymentDto;
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

export interface GetAllOrdersRequestDto {
  orderStatus?: string | null;
  page?: number | null;
  pageSize?: number | null;
  fromDate?: Date | null;
  toDate?: Date | null;
  sortBy?: SortBy | null;
  sortDirection?: SortDirection | null;
  searchTerm?: string | null;
}


export interface GetAllOrdersResponseDto {
  orders: Order[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;}

export enum SortBy {
  Date,
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

export interface AdminOrderItemDto {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  brandName: string;
  unitPrice: number;
  quantity: number;
  size?: string;
  imagePath: string;
  createdAt: Date;
}

export interface AdminShippingAddressDto {
  id: number;
  userId: string;
  addressLine1: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminBillingAddressDto {
  id: number;
  userId: string;
  addressLine1: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminPaymentDto {
  id: number;
  orderId: number;
  paymentMethod: string;
  amount: number;
  status: string;
  transactionId?: string;
  cardLast4?: string;
  billingName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminOrderDto {
  id: number;
  userId: string;
  orderNumber: string;
  orderStatusId: number;
  orderStatusName: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: AdminShippingAddressDto;
  billingAddress: AdminBillingAddressDto;
  payment: AdminPaymentDto;
  orderItems: OrderItemDto[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}