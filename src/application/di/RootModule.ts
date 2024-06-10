import { Module } from '@nestjs/common';
import { InfrastructureModule } from './InfrastructureModule';
import { UserModule } from './UserModule';
import { AuthModule } from './AuthModule';
import { AlbumModule } from './AlbumModule';
import { ImageModule } from './ImageModule';
import { ImageAlbumModule } from './ImageAlbumModule';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { GenerateImageModule } from './GenerateImageModule';
import { AIGenerateImageModule } from '@infrastructure/external-services/ai-generate-image/AIGenerateImageModule';
import { ImageInteractionModule } from './ImageInteractionModule';
import { DashboardImageModule } from './DashboardImageModule';
import { AIFeatureServiceModule } from '@infrastructure/external-services/ai-generate-image/AIFeatureServiceModule';
import { UserManagementModule } from './UserManagementModule';
import { MyElasticsearchModule } from '@infrastructure/external-services/elasticsearch/ElasticsearchModule';
import { LogMonitoringModule } from './LogMonitoringModule';
import { ImageStatisticsModule } from './ImageStatisticsModule';
import { GenerationModule } from './GenerationModule';
import { NotificationModule } from './NotificationModule';
import { GenerateTagModule } from './GenerateTagModule';
import { RateLimiterModule } from './RateLimiterModule';
import { ScheduleJobModule } from './ScheduleJobModule';
import { SocketModule } from '@infrastructure/socket/SocketModule';

@Module({
  imports: [
    InfrastructureModule,
    AIFeatureServiceModule,
    UserModule,
    AuthModule,
    AlbumModule,
    ImageModule,
    ImageAlbumModule,
    ImageStorageModule,
    GenerateImageModule,
    AIGenerateImageModule,
    ImageInteractionModule,
    DashboardImageModule,
    AIFeatureServiceModule,
    UserManagementModule,
    MyElasticsearchModule,
    LogMonitoringModule,
    ImageStatisticsModule,
    GenerateTagModule,
    GenerationModule,
    NotificationModule,
    RateLimiterModule,
    ScheduleJobModule,
    SocketModule,
  ],
  controllers: [],
  providers: [],
})
export class RootModule {}
