import { JwtUtil } from '@core/common/util/jwt/JwtUtil';
import { AlbumController } from '@core/module/album/AlbumController';
import { AlbumRepository } from '@core/module/album/AlbumRepository';
import { AlbumService } from '@core/module/album/AlbumService';
import { Module } from '@nestjs/common';
import { UserModule } from './UserModule';

@Module({
  imports: [UserModule],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository, JwtUtil],
  exports: [AlbumService, AlbumRepository],
})
export class AlbumModule {}
