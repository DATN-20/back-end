import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './AlbumService';
import { CreateAlbumReq } from './entity/request/CreateAlbumReq';
import { User } from '@core/common/decorator/UserDecorator';
import { DeleteAlbumReq } from './entity/request/DeleteAlbumsReq';
import { AlbumMessage } from '@core/common/resource/message/AlbumMessage';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { EditAlbumReq } from './entity/request/EditAlbumReq';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AlbumJson } from './entity/response/AlbumJson';

@ApiTags('Api albums')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('album')
export class AlbumController {
  public constructor(private readonly albumService: AlbumService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: AlbumJson })
  async createNewAlbum(
    @User() user: UserFromAuthGuard,
    @Body() create_album_req: CreateAlbumReq,
  ): Promise<AlbumJson> {
    return this.albumService.handleCreateNewAlbum(user.id, create_album_req.name);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: Array<AlbumJson> })
  async getAlbums(@User() user: UserFromAuthGuard): Promise<AlbumJson[]> {
    return this.albumService.handleViewAlbums(user.id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: String })
  async deleteAlbums(
    @User() user: UserFromAuthGuard,
    @Body() delete_album_req: DeleteAlbumReq,
  ): Promise<string> {
    await this.albumService.handleDeleteAlbums(user.id, delete_album_req.albumIds);
    return AlbumMessage.DELETE_SUCCESS;
  }

  @Patch(':albumId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: AlbumJson })
  async editAlbum(
    @User() user: UserFromAuthGuard,
    @Param('albumId') album_id: number,
    @Body() edit_album_req: EditAlbumReq,
  ): Promise<AlbumJson> {
    return await this.albumService.handleEditAlbum(user.id, album_id, edit_album_req);
  }
}
