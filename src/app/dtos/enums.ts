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

//Order sort by
export enum OrdersSortByEnum {
  Date = 1,
  Total = 2,
}

export const OrdersSortByMeta: Record<OrdersSortByEnum, { label: string }> = {
  [OrdersSortByEnum.Date]: { label: 'Date' },
  [OrdersSortByEnum.Total]: { label: 'Total amount' },
};

//Sort direction
export enum SortDirectionEnum {
  Ascending = 1,
  Descending = 2,
}

export const SortDirectionMeta: Record<SortDirectionEnum, { label: string }> = {
  [SortDirectionEnum.Ascending]: { label: 'Ascending' },
  [SortDirectionEnum.Descending]: { label: 'Descending' },
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

// User status
export enum UserStatusEnum {
  Active = 1,
  Blocked = 2,
}

export const UserStatusMeta: Record<
  UserStatusEnum,
  { label: string; class: string }
> = {
  [UserStatusEnum.Active]: { label: 'Active', class: 'badge bg-success' },
  [UserStatusEnum.Blocked]: { label: 'Blocked', class: 'badge bg-danger' },
};

// Admin users sort by
export enum AdminUsersSortByEnum {
  DateCreated = 1,
  Name = 2,
}

export const AdminUsersSortByMeta: Record<
  AdminUsersSortByEnum,
  { label: string }
> = {
  [AdminUsersSortByEnum.DateCreated]: { label: 'Date created' },
  [AdminUsersSortByEnum.Name]: { label: 'Name' },
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
  { label: string }
> = {
  [ProductSortByOption.NameAsc]: { label: 'Name (A-Z)' },
  [ProductSortByOption.NameDesc]: { label: 'Name (Z-A)' },
  [ProductSortByOption.PriceAsc]: { label: 'Price (Low → High)' },
  [ProductSortByOption.PriceDesc]: { label: 'Price (High → Low)' },
  [ProductSortByOption.BrandAsc]: { label: 'Brand (A-Z)' },
  [ProductSortByOption.BrandDesc]: { label: 'Brand (Z-A)' },
};
