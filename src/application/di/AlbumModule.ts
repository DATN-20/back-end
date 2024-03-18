import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { AlbumController } from '@core/module/album/AlbumController';
import { AlbumRepository } from '@core/module/album/AlbumRepository';
import { AlbumService } from '@core/module/album/AlbumService';
import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from './UserModule';
import { ImageAlbumModule } from './ImageAlbumModule';

@Module({
  imports: [UserModule, forwardRef(() => ImageAlbumModule)],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository, JwtUtil],
  exports: [AlbumService, AlbumRepository],
})
export class AlbumModule {}
