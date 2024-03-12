import { Inject, Injectable } from '@nestjs/common';
import { ImageRepository } from './ImageRepository';
import { Exception } from '@core/common/exception/Exception';
import { ImageError } from '@core/common/resource/error/ImageError';
import { IImageStorageService } from '@core/common/interface/IImageStorageService';
import { ImageResponse } from './entity/Response/ImageResponse';
import { InteractImageRequest } from './entity/Request/InteractImageRequest';
import { ImageInteractionRepository } from '../images-interaction/ImageInteractionRepository';
import { ImageMessage } from '@core/common/resource/message/ImageMessage';

@Injectable()
export class ImageService {
  public constructor(
    private readonly imageRepository: ImageRepository,
    @Inject('ImageStorageService') private readonly imageStorageService: IImageStorageService,
    private readonly imageInteractRepository: ImageInteractionRepository,
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

  async handleDeleteImages(imageIds: number[]): Promise<void> {
    for (const id of imageIds) {
      this.DeleteImage(id);
    }
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
      const result: ImageResponse[] = images.map(image => ImageResponse.convertFromImage(image));
      return result;
    } catch (error) {
      throw new Exception(ImageError.GET_ERROR);
    }
  }

  async handleInteractImage(user_id: number, data: InteractImageRequest): Promise<string> {
    const is_interacted = !!(await this.imageInteractRepository.getPrimaryKey({
      userId: user_id,
      imageId: data.imageId,
      type: data.type,
    }));

    if (is_interacted) {
      await this.imageInteractRepository.delete({
        userId: user_id,
        imageId: data.imageId,
        type: data.type,
      });

      return ImageMessage.INTERACTION_IMAGE(data.type, true);
    }

    await this.imageInteractRepository.create({
      userId: user_id,
      imageId: data.imageId,
      type: data.type,
    });

    return ImageMessage.INTERACTION_IMAGE(data.type, false);
  }
}
