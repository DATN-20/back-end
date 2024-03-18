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

@Module({
  imports: [
    InfrastructureModule,
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
  ],
  controllers: [],
  providers: [],
})
export class RootModule {}
