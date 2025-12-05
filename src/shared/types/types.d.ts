interface IPaginationParams {
  page?: number;
  pageSize?: number;
}

interface IPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface IPaginatedData<T> {
  loading?: boolean;
  pageInfo: IPageInfo;
  items: T[];
}
