import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { LogMonitoringService } from './LogMonitoringService';
import { GetLogsQuery } from './entity/request/GetApiLogsQuery';
import { ApiLogJson } from './entity/response/ApiLogJson';
import { DateUtil } from '@core/common/util/DateUtil';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryPaginationResponse } from '@core/common/type/Pagination';
import { GetSystemLogsQuery } from './entity/request/GetSystemLogsQuery';

@ApiTags(LogMonitoringController.name.replaceAll('Controller', ''))
@ApiBearerAuth()
@Controller('/admin/management/logging')
export class LogMonitoringController {
  constructor(private readonly logMonitoringService: LogMonitoringService) {}

  @ApiResponse({ status: HttpStatus.OK, type: QueryPaginationResponse<ApiLogJson> })
  @Get('api')
  async getApiLogs(
    @Query() query_data: GetLogsQuery,
  ): Promise<QueryPaginationResponse<ApiLogJson>> {
    DateUtil.validateRangeDate(query_data.startDate, query_data.endDate);

    return this.logMonitoringService.handleGetApiLogs(
      query_data.startDate,
      query_data.endDate,
      {
        page: query_data.page,
        limit: query_data.limit,
      },
      query_data.endpoint,
    );
  }

  @ApiResponse({ status: HttpStatus.OK, type: QueryPaginationResponse<GetSystemLogsQuery> })
  @Get('system')
  async getSystemLogs(@Query() query_data: GetSystemLogsQuery) {
    DateUtil.validateRangeDate(query_data.startDate, query_data.endDate);

    return this.logMonitoringService.handleGetSystemLogs(query_data.startDate, query_data.endDate, {
      page: query_data.page,
      limit: query_data.limit,
    });
  }
}
