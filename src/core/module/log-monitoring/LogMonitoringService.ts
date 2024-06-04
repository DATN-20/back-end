import { MyElasticsearchService } from '@infrastructure/external-services/elasticsearch/ElasticsearchService';
import { Injectable } from '@nestjs/common';
import { ApiLogJson } from './entity/response/ApiLogJson';
import { AcceptanceEndpoint } from '@core/common/enum/AcceptanceEndpoint';
import { QueryPagination, QueryPaginationResponse } from '@core/common/type/Pagination';
import { SystemLogJson } from './entity/response/SystemLogJson';

@Injectable()
export class LogMonitoringService {
  constructor(private readonly elasticsearchService: MyElasticsearchService) {}

  async handleGetApiLogs(
    start_date: Date,
    end_date: Date,
    pagination: QueryPagination,
    endpoint?: AcceptanceEndpoint,
  ): Promise<QueryPaginationResponse<ApiLogJson>> {
    const { records, total } = await this.elasticsearchService.getApiLogs(
      start_date,
      end_date,
      pagination,
      endpoint,
    );

    return {
      total: total,
      page: pagination.page,
      limit: pagination.limit,
      data: records,
    };
  }

  async handleGetSystemLogs(
    start_date: Date,
    end_date: Date,
    pagination: QueryPagination,
  ): Promise<QueryPaginationResponse<SystemLogJson>> {
    const { records, total } = await this.elasticsearchService.getSystemLogs(
      start_date,
      end_date,
      pagination,
    );

    return {
      total: total,
      page: pagination.page,
      limit: pagination.limit,
      data: records,
    };
  }
}
