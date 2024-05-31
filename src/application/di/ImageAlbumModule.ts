import { ImageAlbumRepository } from '@core/module/images-album/ImageAlbumRepository';
import { ImageAlbumService } from '@core/module/images-album/ImageAlbumService';
import { DrizzleModule } from '@infrastructure/orm/DrizzleModule';
import { Module, forwardRef } from '@nestjs/common';
import { AlbumModule } from './AlbumModule';
import { ImageModule } from './ImageModule';

@Module({
  imports: [DrizzleModule, forwardRef(() => AlbumModule), ImageModule],
  providers: [ImageAlbumRepository, ImageAlbumService],
  exports: [ImageAlbumRepository, ImageAlbumService],
})
export class ImageAlbumModule {}
