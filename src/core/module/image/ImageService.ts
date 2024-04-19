import { Inject, Injectable } from '@nestjs/common';
import { ImageRepository } from './ImageRepository';
import { Exception } from '@core/common/exception/Exception';
import { ImageError } from '@core/common/resource/error/ImageError';
import { IImageStorageService } from '@core/common/interface/IImageStorageService';
import { ImageResponse } from './entity/response/ImageResponse';
import { InteractImageRequest } from './entity/request/InteractImageRequest';
import { ImageInteractionRepository } from '../images-interaction/ImageInteractionRepository';
import { ImageMessage } from '@core/common/resource/message/ImageMessage';
import { ImageType } from '@core/common/enum/ImageType';
import { NewImage } from './entity/Image';
import { GenerateInputs } from '../generate-image/entity/request/GenerateInputs';
import { GenerateImageListResponse } from './entity/response/GenerateImageListResponse';
import { GenerateByImagesStyleInputs } from '../generate-image/entity/request/GenerateImageByImagesStyleInputs';

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

  //Save image genrated basic by AI to database
  async handleCreateGenerateImages(
    user_id: number,
    list_image_buffer: Buffer[],
    image_type: ImageType,
    prompt: GenerateInputs,
  ) {
    const result: ImageResponse[] = [];

    const generate_id = (await this.imageRepository.getUserMaxGenerateID(user_id)) + 1;

    for (const image_buffer of list_image_buffer) {
      const image_response = await this.handleCreateGenerateImage(
        user_id,
        image_buffer,
        image_type,
        prompt,
        generate_id,
      );

      result.push(image_response);
    }

    return result;
  }

  async handleCreateGenerateImage(
    user_id: number,
    image_buffer: Buffer,
    image_type: ImageType,
    promts: GenerateInputs,
    generate_id: number,
  ) {
    const image_upload_result = await this.imageStorageService.uploadImageWithBuffer(image_buffer);

    const new_image: NewImage = {
      userId: user_id,
      url: image_upload_result.url,
      storageId: image_upload_result.id,
      type: image_type,
      prompt: promts.positivePrompt,
      aiName: promts.aiName,
      style: promts.style,
      generateId: generate_id,
    };
    const image = await this.imageRepository.create(new_image);

    const image_response = ImageResponse.convertFromImage(image);

    return image_response;
  }

  //Save image genrated by images style to database
  async handleCreateGenerateImagesByImagesStyle(
    user_id: number,
    list_image_buffer: Buffer[],
    image_type: ImageType,
    prompt: GenerateByImagesStyleInputs,
  ) {
    const result: ImageResponse[] = [];

    const generate_id = (await this.imageRepository.getUserMaxGenerateID(user_id)) + 1;

    for (const image_buffer of list_image_buffer) {
      const image_response = await this.handleCreateGenerateImageByImagesStyle(
        user_id,
        image_buffer,
        image_type,
        prompt,
        generate_id,
      );

      result.push(image_response);
    }

    return result;
  }

  async handleCreateGenerateImageByImagesStyle(
    user_id: number,
    image_buffer: Buffer,
    image_type: ImageType,
    promts: GenerateByImagesStyleInputs,
    generate_id: number,
  ) {
    const image_upload_result = await this.imageStorageService.uploadImageWithBuffer(image_buffer);

    const new_image: NewImage = {
      userId: user_id,
      url: image_upload_result.url,
      storageId: image_upload_result.id,
      type: image_type,
      prompt: promts.positivePrompt,
      aiName: promts.aiName,
      generateId: generate_id,
    };
    const image = await this.imageRepository.create(new_image);

    const image_response = ImageResponse.convertFromImage(image);

    return image_response;
  }

  async handleGetGenerateImageHistory(user_id: number) {
    const generatedImageTypes = [ImageType.IMG_TO_IMG, ImageType.TEXT_TO_IMG];
    const images = await this.imageRepository.getByUserIdAndImageTypes(
      user_id,
      generatedImageTypes,
    );

    images.sort((a, b) => b.generateId - a.generateId);

    const generateImagesList = [];

    for (const image of images) {
      if (
        generateImagesList.length == 0 ||
        image.generateId != generateImagesList[generateImagesList.length - 1].getGenerateId()
      ) {
        generateImagesList.push(
          new GenerateImageListResponse(image.style, image.prompt, image.generateId),
        );
      }
      const image_response = new ImageResponse(image);
      generateImagesList[generateImagesList.length - 1].addImage(image_response);
    }

    const result = generateImagesList.map(generateImages => generateImages.toJson());

    return result;
  }
}
