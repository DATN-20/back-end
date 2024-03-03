import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AlbumService } from './AlbumService';
import { CreateAlbumReq } from './entity/request/CreateAlbumReq';
import { User } from '@core/common/decorator/UserDecorator';

@Controller('album')
export class AlbumController {
  public constructor(private readonly albumService: AlbumService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createNewAblum(@User() user_id: number, @Body() createAlbumReq: CreateAlbumReq) {}
}
