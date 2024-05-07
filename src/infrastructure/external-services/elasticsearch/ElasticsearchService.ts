import { DateUtil } from '@core/common/util/DateUtil';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

const INDEX_PATTERN: string = 'logs-*';

@Injectable()
export class MyElasticsearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async countLogs(user_id: number, endpoint: string, date: Date): Promise<number> {
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
}
