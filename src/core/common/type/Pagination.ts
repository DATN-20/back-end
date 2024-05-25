type QueryPagination = {
  page: number;
  limit: number;
};

type QueryPaginationResponse<T> = {
  page: number;
  limit: number;
  total: number;
  data: T[];
  profile?: any;
};
