import { ImageAlbumRepository } from '@core/module/images-album/ImageAlbumRepository';
import { ImageAlbumService } from '@core/module/images-album/ImageAlbumService';
import { DrizzleModule } from '@infrastructure/orm/DrizzleModule';
import { Module, forwardRef } from '@nestjs/common';
import { AlbumModule } from './AlbumModule';

@Module({
  imports: [DrizzleModule, forwardRef(() => AlbumModule)],
  providers: [ImageAlbumRepository, ImageAlbumService],
  exports: [ImageAlbumRepository, ImageAlbumService],
})
export class ImageAlbumModule {}
