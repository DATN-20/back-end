import { AcceptanceEndpoint } from '@core/common/enum/AcceptanceEndpoint';
import { DateUtil } from '@core/common/util/DateUtil';
import { LogMonitoringJson } from '@core/module/log-monitoring/entity/LogMonitoringJson';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

const INDEX_PATTERN: string = 'logs-*';

@Injectable()
export class MyElasticsearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async countLogsForSpecificUser(user_id: number, endpoint: string, date: Date): Promise<number> {
    const { count } = await this.elasticsearchService.count({
      index: INDEX_PATTERN,
      body: {
        query: {
          bool: {
            filter: [
              {
                term: {
                  'fields.user_id': {
                    value: user_id,
                  },
                },
              },
              {
                term: {
                  'fields.api_endpoint.keyword': {
                    value: endpoint,
                  },
                },
              },
              {
                range: {
                  '@timestamp': {
                    gte: `${DateUtil.formatDate(date, 'YYYY-MM-DD')}T00:00:00`,
                    lte: `${DateUtil.formatDate(date, 'YYYY-MM-DD')}T23:59:59`,
                    format: "yyyy-MM-dd'T'HH:mm:ss",
                  },
                },
              },
            ],
          },
        },
      },
    });

    return count;
  }

  async getLogs(
    start_date: Date,
    end_date: Date,
    pagination: QueryPagination,
    endpoint?: AcceptanceEndpoint,
  ): Promise<{ records: LogMonitoringJson[]; total: number }> {
    let query_filter = [
      {
        range: {
          '@timestamp': {
            gte: `${DateUtil.formatDate(start_date, 'YYYY-MM-DD')}T00:00:00`,
            lte: `${DateUtil.formatDate(end_date, 'YYYY-MM-DD')}T23:59:59`,
            format: "yyyy-MM-dd'T'HH:mm:ss",
          },
        },
      },
      {
        term: {
          'fields.api_endpoint.keyword': {
            value: endpoint ?? '',
          },
        },
      },
    ];

    if (!endpoint) {
      query_filter.splice(1, 1);
    }

    let records = await this.elasticsearchService.search({
      index: INDEX_PATTERN,
      from: (pagination.page - 1) * pagination.limit,
      size: pagination.limit,
      body: {
        query: {
          bool: {
            filter: query_filter,
          },
        },
      },
    });

    const { count: total_record } = await this.elasticsearchService.count({
      index: INDEX_PATTERN,
      body: {
        query: {
          bool: {
            filter: query_filter,
          },
        },
      },
    });

    const result_records = records.hits.hits.map(record => {
      const { _source: record_information } = record;
      return {
        user_id: record_information['fields'].user_id,
        requested_at: record_information['fields'].timestamp,
        endpoint: record_information['fields'].api_endpoint,
        severity: record_information['severity'],
        message: record_information['message'],
        file: record._index,
      };
    });

    return { records: result_records, total: total_record };
  }
}
