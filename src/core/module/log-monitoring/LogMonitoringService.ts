import { MyElasticsearchService } from '@infrastructure/external-services/elasticsearch/ElasticsearchService';
import { Injectable } from '@nestjs/common';
import { LogMonitoringJson } from './entity/LogMonitoringJson';
import { AcceptanceEndpoint } from '@core/common/enum/AcceptanceEndpoint';
import { QueryPagination, QueryPaginationResponse } from '@core/common/type/Pagination';

@Injectable()
export class LogMonitoringService {
  constructor(private readonly elasticsearchService: MyElasticsearchService) {}

  async handleGetLogs(
    start_date: Date,
    end_date: Date,
    pagination: QueryPagination,
    endpoint?: AcceptanceEndpoint,
  ): Promise<QueryPaginationResponse<LogMonitoringJson>> {
    const { records, total } = await this.elasticsearchService.getLogs(
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
}
