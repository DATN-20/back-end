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
import { ImageAlbumRequest } from '../images-album/entity/request/ImageAlbumRequest';
import { Image } from '../image/entity/Image';
import { ImageAlbumService } from '../images-album/ImageAlbumService';
import { ImageAlbumMessage } from '@core/common/resource/message/ImageAlbumMessage';
import { ImageAlbumResponse } from '../images-album/entity/response/ImageAlbumResponse';
import { AlbumWithImageResponse } from './entity/response/AlbumWithImageResponse';

@UseGuards(AuthGuard)
@Controller('album')
export class AlbumController {
  public constructor(
    private readonly albumService: AlbumService,
    private readonly imageAlbumService: ImageAlbumService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createNewAlbum(@User() user: UserFromAuthGuard, @Body() create_album_req: CreateAlbumReq) {
    return this.albumService.handleCreateNewAlbum(user.id, create_album_req.name);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAlbums(@User() user: UserFromAuthGuard) {
    return this.albumService.handleViewAlbums(user.id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteAlbums(@User() user: UserFromAuthGuard, @Body() delete_album_req: DeleteAlbumReq) {
    await this.albumService.handleDeleteAlbums(user.id, delete_album_req.albumIds);
    return AlbumMessage.DELETE_SUCCESS;
  }

  @Patch(':albumId')
  @HttpCode(HttpStatus.OK)
  async editAlbum(
    @User() user: UserFromAuthGuard,
    @Param('albumId') album_id: number,
    @Body() edit_album_req: EditAlbumReq,
  ) {
    return await this.albumService.handleEditAlbum(user.id, album_id, edit_album_req);
  }

  // image album controller section
  // add image to album, remove image from album, get all images in album
  @Get('full-info')
  async getFullInfo(@User() user: UserFromAuthGuard): Promise<AlbumWithImageResponse[]> {
    return this.albumService.getFullInfo(user.id);
  }
  @Post(':albumId/add-image')
  addImageToAlbum(
    @User() user: UserFromAuthGuard,
    @Param('albumId') album_id: number,
    @Body() imageAlbumRequest: ImageAlbumRequest,
  ): Promise<ImageAlbumResponse[]> {
    return this.imageAlbumService.addImageToAlbum(user.id, album_id, imageAlbumRequest);
  }
  @Delete(':albumId/remove-image')
  async removeImageFromAlbum(
    @User() user: UserFromAuthGuard,
    @Param('albumId') album_id: number,
    @Body() image_album_request: ImageAlbumRequest,
  ): Promise<string> {
    await this.imageAlbumService.removeImageFromAlbum(user.id, album_id, image_album_request);
    return ImageAlbumMessage.DELETE_SUCCESS;
  }

  @Get(':albumId/images')
  getAllImagesInAlbum(
    @User() user: UserFromAuthGuard,
    @Param('albumId') album_id: number,
  ): Promise<ImageAlbumResponse[]> {
    return this.imageAlbumService.getAllImagesInAlbum(user.id, album_id);
  }
}
