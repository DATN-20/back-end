import { Controller } from '@nestjs/common';
import { AlbumService } from './AlbumService';

@Controller('album')
export class AlbumController {
  public constructor(private readonly albumService: AlbumService) {}
}
