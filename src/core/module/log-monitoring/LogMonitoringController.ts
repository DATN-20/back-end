import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { LogMonitoringService } from './LogMonitoringService';
import { GetLogsQuery } from './entity/request/GetLogsQuery';
import { LogMonitoringJson } from './entity/LogMonitoringJson';
import { DateUtil } from '@core/common/util/DateUtil';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryPaginationResponse } from '@core/common/type/Pagination';

@ApiTags(LogMonitoringController.name.replaceAll('Controller', ''))
@Controller('/admin/management/logging')
export class LogMonitoringController {
  constructor(private readonly logMonitoringService: LogMonitoringService) {}

  @ApiResponse({ status: HttpStatus.OK, type: QueryPaginationResponse<LogMonitoringJson> })
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
