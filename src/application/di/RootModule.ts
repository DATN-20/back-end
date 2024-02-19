import { Module } from '@nestjs/common';
import { InfrastructureModule } from './InfrastructureModule';
import { UserModule } from './UserModule';
import { AuthModule } from './AuthModule';
import { AlbumModule } from './AlbumModule';
import { ImageModule } from './ImageModule';
import { ImageAlbumModule } from './ImageAlbumModule';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { AIGenerateImageModule } from './AIGenerateImageModule';

@Module({
  imports: [
    InfrastructureModule,
    UserModule,
    AuthModule,
    AlbumModule,
    ImageModule,
    ImageAlbumModule,
    ImageStorageModule,
    AIGenerateImageModule,
  ],
  controllers: [],
  providers: [],
})
export class RootModule {}
