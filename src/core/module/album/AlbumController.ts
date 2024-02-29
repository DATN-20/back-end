import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AlbumService } from './AlbumService';
import { CreateAlbumReq } from './entity/request/CreateAlbumReq';

@Controller('album')
export class AlbumController {
  public constructor(private readonly albumService: AlbumService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createNewAblum(@Body() createAlbumReq: CreateAlbumReq) {}
}
