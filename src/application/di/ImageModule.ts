import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { ImageController } from '@core/module/image/ImageController';
import { ImageRepository } from '@core/module/image/ImageRepository';
import { ImageService } from '@core/module/image/ImageService';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { Module } from '@nestjs/common';
import { UserModule } from './UserModule';
import { ImageInteractionModule } from './ImageInteractionModule';
import { DashboardImageModule } from './DashboardImageModule';

@Module({
  imports: [ImageStorageModule, UserModule, ImageInteractionModule, DashboardImageModule],
  controllers: [ImageController],
  providers: [ImageService, ImageRepository, JwtUtil],
  exports: [ImageService, ImageRepository],
})
export class ImageModule {}
