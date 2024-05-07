import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { MyElasticsearchService } from './ElasticsearchService';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_URL'),
      }),
    }),
  ],
  providers: [MyElasticsearchService],
  exports: [MyElasticsearchService],
})
export class MyElasticsearchModule {}
