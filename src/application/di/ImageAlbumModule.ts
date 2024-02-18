import { ImageAlbumRepository } from '@core/module/images-album/ImageAlbumRepository';
import { ImageAlbumService } from '@core/module/images-album/ImageAlbumService';
import { DrizzleModule } from '@infrastructure/orm/DrizzleModule';
import { Module } from '@nestjs/common';

@Module({
  imports: [DrizzleModule],
  providers: [ImageAlbumRepository, ImageAlbumService],
  exports: [ImageAlbumRepository, ImageAlbumService],
})
export class ImageAlbumModule {}
