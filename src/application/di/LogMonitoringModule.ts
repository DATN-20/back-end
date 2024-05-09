import { LogMonitoringController } from '@core/module/log-monitoring/LogMonitoringController';
import { LogMonitoringService } from '@core/module/log-monitoring/LogMonitoringService';
import { MyElasticsearchModule } from '@infrastructure/external-services/elasticsearch/ElasticsearchModule';
import { Module } from '@nestjs/common';

@Module({
  imports: [MyElasticsearchModule],
  controllers: [LogMonitoringController],
  providers: [LogMonitoringService],
  exports: [LogMonitoringService],
})
export class LogMonitoringModule {}
