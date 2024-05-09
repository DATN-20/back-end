import { Controller, Get, Query } from '@nestjs/common';
import { LogMonitoringService } from './LogMonitoringService';
import { GetLogsQuery } from './entity/request/GetLogsQuery';
import { LogMonitoringJson } from './entity/LogMonitoringJson';
import { DateUtil } from '@core/common/util/DateUtil';

@Controller('/managment/logging')
export class LogMonitoringController {
  constructor(private readonly logMonitoringService: LogMonitoringService) {}

  @Get('api')
  async getLogs(
    @Query() query_data: GetLogsQuery,
  ): Promise<QueryPaginationResponse<LogMonitoringJson>> {
    DateUtil.validateRangeDate(query_data.startDate, query_data.endDate);

    return this.logMonitoringService.handleGetLogs(
      query_data.startDate,
      query_data.endDate,
      {
        page: query_data.page,
        limit: query_data.limit,
      },
      query_data.endpoint,
    );
  }
}
