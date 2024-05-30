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
import { ImageAlbumService } from '../images-album/ImageAlbumService';
import { ImageAlbumMessage } from '@core/common/resource/message/ImageAlbumMessage';
import { ImageResponseJson } from '../image/entity/response/ImageResponseJson';
import { AlbumWithImagesResponseJson } from './entity/response/AlbumWithImagesResponseJson';
import { ParamValidator } from '@core/common/util/ParamValidator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AlbumResponseJson } from './entity/response/AlbumResponseJson';

@ApiTags(AlbumController.name.replaceAll('Controller', ''))
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('albums')
export class AlbumController {
  public constructor(
    private readonly albumService: AlbumService,
    private readonly imageAlbumService: ImageAlbumService,
  ) {}

  @ApiResponse({ status: HttpStatus.OK, type: AlbumResponseJson })
  @Post()
  @HttpCode(HttpStatus.OK)
  async createNewAlbum(
    @User() user: UserFromAuthGuard,
    @Body() create_album_req: CreateAlbumReq,
  ): Promise<AlbumResponseJson> {
    return this.albumService.handleCreateNewAlbum(user.id, create_album_req.name);
  }

  @ApiResponse({ status: HttpStatus.OK, type: AlbumResponseJson, isArray: true })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAlbums(@User() user: UserFromAuthGuard): Promise<AlbumResponseJson[]> {
    return this.albumService.handleViewAlbums(user.id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteAlbums(@User() user: UserFromAuthGuard, @Body() delete_album_req: DeleteAlbumReq) {
    await this.albumService.handleDeleteAlbums(user.id, delete_album_req.albumIds);
    return AlbumMessage.DELETE_SUCCESS;
  }

  @ApiResponse({ status: HttpStatus.OK, type: AlbumWithImagesResponseJson, isArray: true })
  @Get('full-info')
  async getFullInfo(@User() user: UserFromAuthGuard): Promise<AlbumWithImagesResponseJson[]> {
    return this.albumService.getFullInfo(user.id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: AlbumResponseJson })
  @Patch(':albumId')
  @HttpCode(HttpStatus.OK)
  async editAlbum(
    @User() user: UserFromAuthGuard,
    @Param('albumId', ParamValidator) album_id: number,
    @Body() edit_album_req: EditAlbumReq,
  ): Promise<AlbumResponseJson> {
    return await this.albumService.handleEditAlbum(user.id, album_id, edit_album_req);
  }

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Delete(':albumId/images')
  async removeImageFromAlbum(
    @User() user: UserFromAuthGuard,
    @Param('albumId', ParamValidator) album_id: number,
    @Body() image_album_request: ImageAlbumRequest,
  ): Promise<string> {
    await this.imageAlbumService.removeImageFromAlbum(user.id, album_id, image_album_request);
    return ImageAlbumMessage.DELETE_SUCCESS;
  }

  @ApiResponse({ status: HttpStatus.OK, type: AlbumResponseJson, isArray: true })
  @Get(':albumId/images')
  getAllImagesInAlbum(
    @User() user: UserFromAuthGuard,
    @Param('albumId', ParamValidator) album_id: number,
  ): Promise<ImageResponseJson[]> {
    return this.imageAlbumService.getAllImagesInAlbum(user.id, album_id);
  }

  @ApiResponse({ status: HttpStatus.OK, type: AlbumResponseJson, isArray: true })
  @Post('/:albumId/images')
  addImageToAlbum(
    @User() user: UserFromAuthGuard,
    @Param('albumId', ParamValidator) album_id: number,
    @Body() image_album_request: ImageAlbumRequest,
  ): Promise<ImageResponseJson[]> {
    return this.imageAlbumService.addImageToAlbum(user.id, album_id, image_album_request);
  }
}
