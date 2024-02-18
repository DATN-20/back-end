import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { ImageController } from '@core/module/image/ImageController';
import { ImageRepository } from '@core/module/image/ImageRepository';
import { ImageService } from '@core/module/image/ImageService';
import { ImageStorageModule } from '@infrastructure/external-services/image-storage/ImageStorageModule';
import { DrizzleModule } from '@infrastructure/orm/DrizzleModule';
import { Module } from '@nestjs/common';
import { InfrastructureModule } from './InfrastructureModule';
import { UserModule } from './UserModule';

@Module({
  imports: [ImageStorageModule, UserModule],
  controllers: [ImageController],
  providers: [ImageService, ImageRepository, JwtUtil],
  exports: [ImageService, ImageRepository],
})
export class ImageModule {}
