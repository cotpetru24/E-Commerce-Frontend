










export interface GetUserOrdersRequestDto {
  pageNumber?: number;
  pageSize?: number;
  statusFilter?: string;
  fromDate?: Date;
  toDate?: Date;
}