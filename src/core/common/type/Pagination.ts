import { ApiProperty } from '@nestjs/swagger';

export class QueryPagination {
  @ApiProperty()
  page: number;
  @ApiProperty()
  limit: number;
}

export class QueryPaginationResponse<T> {
  @ApiProperty()
  page: number;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  total: number;
  @ApiProperty()
  data: T[];
}
