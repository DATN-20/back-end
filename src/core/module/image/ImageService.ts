import { Inject, Injectable } from '@nestjs/common';
import { ImageRepository } from './ImageRepository';
import { Exception } from '@core/common/exception/Exception';
import { ImageError } from '@core/common/resource/error/ImageError';
import { IImageStorageService } from '@core/common/interface/IImageStorageService';
import { ImageResponse } from './entity/Response/ImageResponse';
import { ImageMessage } from '@core/common/resource/message/ImageMessage';

@Injectable()
export class ImageService {
  public constructor(
    private readonly imageRepository: ImageRepository,
    @Inject('ImageStorageService') private readonly imageStorageService: IImageStorageService,
  ) {}

  async handleUploadImages(
    userId: number,
    images: Express.Multer.File[],
  ): Promise<ImageResponse[]> {
    if (images == null) {
      throw new Exception(ImageError.IMAGES_LIST_EMPTY);
    }
    const result: ImageResponse[] = [];
    const imageUploadResults: ImageUploadResult[] = await this.imageStorageService.uploadImages({
      images,
    });
    try {
      for (const imageUpload of imageUploadResults) {
        const image = await this.imageRepository.create({
          userId,
          url: imageUpload.url,
          storageId: imageUpload.id,
        });
        result.push(ImageResponse.convertFromImage(image));
      }
      return result;
    } catch (error) {
      throw new Exception(ImageError.UPLOAD_ERROR);
    }
  }

  async handleDeleteImages(imageIds: number[]): Promise<String> {
    for (const id of imageIds) {
      this.DeleteImage(id);
    }
    return ImageMessage.DELETE_SUCCESS;
  }

  async DeleteImage(id: number): Promise<void> {
    const image = await this.imageRepository.getById(id);
    if (!image) {
      throw new Exception(ImageError.IMAGE_NOT_FOUND);
    }
    await this.imageStorageService.deleteImage({ storageIds: image.storageId });
    await this.imageRepository.deleteById(id);
  }

  async handleGetImagesOfUser(userId: number): Promise<ImageResponse[]> {
    try {
      const images = await this.imageRepository.getByUserId(userId);
      const result: ImageResponse[] = images.map((image) => ImageResponse.convertFromImage(image));
      return result;
    } catch (error) {
      throw new Exception(ImageError.GET_ERROR);
    }
  }
}
