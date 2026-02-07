//Sort direction
export enum SortDirectionEnum {
  Ascending = 1,
  Descending = 2,
}

export const SortDirectionMeta: Record<SortDirectionEnum, { label: string }> = {
  [SortDirectionEnum.Ascending]: { label: 'Ascending' },
  [SortDirectionEnum.Descending]: { label: 'Descending' },
};

//Order status
export enum OrderStatusEnum {
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
  PaymentFailed = 6,
  Returned = 7,
}

export const OrderStatusMeta: Record<
  OrderStatusEnum,
  {
    label: string;
    class: string;
    isProcessing: boolean;
    canCancel: boolean;
    canShip: boolean;
    canReturn: boolean;
    isFinal: boolean;
  }
> = {
  [OrderStatusEnum.Processing]: {
    label: 'Processing',
    class: 'badge bg-info',
    isProcessing: true,
    canCancel: true,
    canShip: true,
    canReturn: false,
    isFinal: false,
  },

  [OrderStatusEnum.Shipped]: {
    label: 'Shipped',
    class: 'badge bg-primary',
    isProcessing: false,
    canCancel: false,
    canShip: false,
    canReturn: false,
    isFinal: false,
  },

  [OrderStatusEnum.Delivered]: {
    label: 'Delivered',
    class: 'badge bg-success',
    isProcessing: false,
    canCancel: false,
    canShip: false,
    canReturn: true,
    isFinal: false,
  },

  [OrderStatusEnum.Cancelled]: {
    label: 'Cancelled',
    class: 'badge bg-danger',
    isProcessing: false,
    canCancel: false,
    canShip: false,
    canReturn: false,
    isFinal: true,
  },

  [OrderStatusEnum.PaymentFailed]: {
    label: 'Payment Failed',
    class: 'badge bg-warning',
    isProcessing: false,
    canCancel: true,
    canShip: false,
    canReturn: false,
    isFinal: false,
  },

  [OrderStatusEnum.Returned]: {
    label: 'Returned',
    class: 'badge bg-secondary',
    isProcessing: false,
    canCancel: false,
    canShip: false,
    canReturn: false,
    isFinal: true,
  },
};

export const OrderStatusUpdateConstraints: Partial<
  Record<OrderStatusEnum, OrderStatusEnum[]>
> = {
  [OrderStatusEnum.Processing]: [
    OrderStatusEnum.Shipped,
    OrderStatusEnum.Cancelled,
  ],
  [OrderStatusEnum.Shipped]: [OrderStatusEnum.Delivered],
  [OrderStatusEnum.Delivered]: [OrderStatusEnum.Returned],
  [OrderStatusEnum.Cancelled]: [],
  [OrderStatusEnum.Returned]: [],
};

//Order sort by
export enum OrdersSortByEnum {
  Date = 1,
  Total = 2,
}

export enum OrdersSortByOption {
  DateDesc = 1,
  DateAsc = 2,
  TotalAsc = 3,
  TotalDesc = 4,
}

export const OrdersSortByMeta: Record<OrdersSortByEnum, { label: string }> = {
  [OrdersSortByEnum.Date]: { label: 'Date' },
  [OrdersSortByEnum.Total]: { label: 'Total amount' },
};

export const OrdersSortByOptionMeta: Record<
  OrdersSortByOption,
  {
    label: string;
    sortBy: OrdersSortByEnum;
    sortDirection: SortDirectionEnum;
  }
> = {
  [OrdersSortByOption.DateDesc]: {
    label: 'Date (Newest)',
    sortBy: OrdersSortByEnum.Date,
    sortDirection: SortDirectionEnum.Descending,
  },
  [OrdersSortByOption.DateAsc]: {
    label: 'Date (Oldest)',
    sortBy: OrdersSortByEnum.Date,
    sortDirection: SortDirectionEnum.Ascending,
  },
  [OrdersSortByOption.TotalAsc]: {
    label: 'Total (Low to High)',
    sortBy: OrdersSortByEnum.Total,
    sortDirection: SortDirectionEnum.Ascending,
  },
  [OrdersSortByOption.TotalDesc]: {
    label: 'Total (High to Low)',
    sortBy: OrdersSortByEnum.Total,
    sortDirection: SortDirectionEnum.Descending,
  },
};

//Admin orders timeframe
export enum AdminOrdersTimeframeOption {
  Today = 1,
  ThisWeek = 2,
  ThisMonth = 3,
  ThisQuarter = 4,
}

export const AdminOrdersTimeframeOptionMeta: Record<
  AdminOrdersTimeframeOption,
  { label: string }
> = {
  [AdminOrdersTimeframeOption.Today]: { label: 'Today' },
  [AdminOrdersTimeframeOption.ThisWeek]: { label: 'This Week' },
  [AdminOrdersTimeframeOption.ThisMonth]: { label: 'This Month' },
  [AdminOrdersTimeframeOption.ThisQuarter]: { label: 'This Quarter' },
};

//Payment status
export enum PaymentStatusEnum {
  Pending = 1,
  Authorised = 3,
  Failed = 4,
  Refunded = 6,
  Paid = 12,
}

export const PaymentStatusMeta: Record<
  PaymentStatusEnum,
  { label: string; class: string }
> = {
  [PaymentStatusEnum.Pending]: {
    label: 'Pending',
    class: 'badge bg-secondary',
  },
  [PaymentStatusEnum.Authorised]: {
    label: 'Authorised',
    class: 'badge bg-secondary',
  },
  [PaymentStatusEnum.Paid]: { label: 'Paid', class: 'badge bg-success' },
  [PaymentStatusEnum.Refunded]: {
    label: 'Refunded',
    class: 'badge bg-warning',
  },
  [PaymentStatusEnum.Failed]: { label: 'Failed', class: 'badge bg-danger' },
};

//User role
export enum UserRoleEnum {
  Administrator = 1,
  Customer = 2,
}

export const UserRoleMeta: Record<
  UserRoleEnum,
  { label: string; class: string }
> = {
  [UserRoleEnum.Administrator]: {
    label: 'Administrator',
    class: 'badge bg-danger',
  },
  [UserRoleEnum.Customer]: { label: 'Customer', class: 'badge bg-info' },
};

// Admin users sort by
export enum AdminUsersSortByEnum {
  DateCreated = 1,
  Name = 2,
}

export enum AdminUsersSortByOption {
  DateDesc = 1,
  DateAsc = 2,
  NameAsc = 3,
  NameDesc = 4,
}

export const AdminUsersSortByOptionsMeta: Record<
  AdminUsersSortByOption,
  {
    label: string;
    sortBy: AdminUsersSortByEnum;
    sortDirection: SortDirectionEnum;
  }
> = {
  [AdminUsersSortByOption.DateDesc]: {
    label: 'Date Created (Newest)',
    sortBy: AdminUsersSortByEnum.DateCreated,
    sortDirection: SortDirectionEnum.Descending,
  },
  [AdminUsersSortByOption.DateAsc]: {
    label: 'Date Created (Oldest)',
    sortBy: AdminUsersSortByEnum.DateCreated,
    sortDirection: SortDirectionEnum.Ascending,
  },
  [AdminUsersSortByOption.NameAsc]: {
    label: 'Name (A-Z)',
    sortBy: AdminUsersSortByEnum.Name,
    sortDirection: SortDirectionEnum.Ascending,
  },
  [AdminUsersSortByOption.NameDesc]: {
    label: 'Name (Z-A)',
    sortBy: AdminUsersSortByEnum.Name,
    sortDirection: SortDirectionEnum.Descending,
  },
};

//Product status
export enum ProductStatusEmun {
  Active = 1,
  Inactive = 2,
}

export const ProductStatusMeta: Record<
  ProductStatusEmun,
  { label: string; class: string }
> = {
  [ProductStatusEmun.Active]: {
    label: 'Active',
    class: 'badge bg-success',
  },
  [ProductStatusEmun.Inactive]: {
    label: 'Inactive',
    class: 'badge bg-secondary',
  },
};

// Audience
export enum AudienceEnum {
  Men = 1,
  Women = 2,
  Children = 3,
  Unisex = 4,
}

export const AudienceMeta: Record<
  AudienceEnum,
  { label: string; class: string }
> = {
  [AudienceEnum.Men]: { label: 'Men', class: 'bg-men' },
  [AudienceEnum.Women]: { label: 'Women', class: 'bg-women' },
  [AudienceEnum.Children]: { label: 'Children', class: 'bg-children' },
  [AudienceEnum.Unisex]: { label: 'Unisex', class: 'bg-success' },
};

//Admin product stock status
export enum AdminProductStockStatusEnum {
  LowStock = 1,
  HighStock = 2,
  InStock = 3,
  OutOfStock = 4,
}

export const AdminProductStockStatusMeta: Record<
  AdminProductStockStatusEnum,
  { label: string; class: string }
> = {
  [AdminProductStockStatusEnum.LowStock]: {
    label: 'Low stock',
    class: 'badge bg-warning',
  },
  [AdminProductStockStatusEnum.HighStock]: {
    label: 'High stock',
    class: 'badge bg-info',
  },
  [AdminProductStockStatusEnum.InStock]: {
    label: 'In stock',
    class: 'badge bg-success',
  },
  [AdminProductStockStatusEnum.OutOfStock]: {
    label: 'Out of stock',
    class: 'badge bg-danger',
  },
};

// Product sort by
export enum ProductSortByEnum {
  Name = 1,
  Price = 2,
  Brand = 3,
}
export enum ProductSortByOption {
  NameAsc = 1,
  NameDesc = 2,
  PriceAsc = 3,
  PriceDesc = 4,
  BrandAsc = 5,
  BrandDesc = 6,
}

export const ProductSortByOptionMeta: Record<
  ProductSortByOption,
  { label: string; sortBy: ProductSortByEnum; sortDirection: SortDirectionEnum }
> = {
  [ProductSortByOption.NameAsc]: {
    label: 'Name (A-Z)',
    sortBy: ProductSortByEnum.Name,
    sortDirection: SortDirectionEnum.Ascending,
  },
  [ProductSortByOption.NameDesc]: {
    label: 'Name (Z-A)',
    sortBy: ProductSortByEnum.Name,
    sortDirection: SortDirectionEnum.Descending,
  },
  [ProductSortByOption.PriceAsc]: {
    label: 'Price (Low → High)',
    sortBy: ProductSortByEnum.Price,
    sortDirection: SortDirectionEnum.Descending,
  },
  [ProductSortByOption.PriceDesc]: {
    label: 'Price (High → Low)',
    sortBy: ProductSortByEnum.Price,
    sortDirection: SortDirectionEnum.Descending,
  },
  [ProductSortByOption.BrandAsc]: {
    label: 'Brand (A-Z)',
    sortBy: ProductSortByEnum.Brand,
    sortDirection: SortDirectionEnum.Ascending,
  },
  [ProductSortByOption.BrandDesc]: {
    label: 'Brand (Z-A)',
    sortBy: ProductSortByEnum.Brand,
    sortDirection: SortDirectionEnum.Descending,
  },
};

// Admin product sort by
export enum AdminProductsSortByEnum {
  DateCreated = 1,
  Name = 2,
  Stock = 3,
}

export const AdminProductsSortByMeta: Record<
  AdminProductsSortByEnum,
  { label: string }
> = {
  [AdminProductsSortByEnum.DateCreated]: { label: 'Date created' },
  [AdminProductsSortByEnum.Name]: { label: 'Name' },
  [AdminProductsSortByEnum.Stock]: { label: 'Stock' },
};

// Admin product sort by
export enum AdminProductSortByOption {
  DateDesc = 1,
  DateAsc = 2,
  NameAsc = 3,
  NameDesc = 4,
  StockAsc = 5,
  StockDesc = 6,
}

export const AdminProductSortByOptionMeta: Record<
  AdminProductSortByOption,
  {
    label: string;
    sortBy: AdminProductsSortByEnum;
    sortDirection: SortDirectionEnum;
  }
> = {
  [AdminProductSortByOption.DateDesc]: {
    label: 'Date Created (Newest)',
    sortBy: AdminProductsSortByEnum.DateCreated,
    sortDirection: SortDirectionEnum.Descending,
  },
  [AdminProductSortByOption.DateAsc]: {
    label: 'Date Created (Oldest)',
    sortBy: AdminProductsSortByEnum.DateCreated,
    sortDirection: SortDirectionEnum.Ascending,
  },
  [AdminProductSortByOption.NameAsc]: {
    label: 'Name (A-Z)',
    sortBy: AdminProductsSortByEnum.Name,
    sortDirection: SortDirectionEnum.Ascending,
  },
  [AdminProductSortByOption.NameDesc]: {
    label: 'Name (Z-A)',
    sortBy: AdminProductsSortByEnum.Name,
    sortDirection: SortDirectionEnum.Descending,
  },
  [AdminProductSortByOption.StockAsc]: {
    label: 'Stock (Low → High)',
    sortBy: AdminProductsSortByEnum.Stock,
    sortDirection: SortDirectionEnum.Ascending,
  },
  [AdminProductSortByOption.StockDesc]: {
    label: 'Stock (High → Low)',
    sortBy: AdminProductsSortByEnum.Stock,
    sortDirection: SortDirectionEnum.Descending,
  },
};
