import { AlbumController } from '@core/module/album/AlbumController';
import { AlbumRepository } from '@core/module/album/AlbumRepository';
import { AlbumService } from '@core/module/album/AlbumService';
import { DrizzleModule } from '@infrastructure/orm/DrizzleModule';
import { Module } from '@nestjs/common';

@Module({
  imports: [DrizzleModule],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository],
  exports: [AlbumService, AlbumRepository],
})
export class AlbumModule {}
