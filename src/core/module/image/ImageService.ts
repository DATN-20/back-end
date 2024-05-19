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
import { UrlUtil } from '@core/common/util/UrlUtil';
import { AIFeatureServiceManager } from '@infrastructure/external-services/ai-generate-image/AIFeatureServiceManager';
import { ProcessType } from './entity/ProcessType';
import { GenerateByImagesStyleInputs } from '../generate-image/entity/request/GenerateImageByImagesStyleInputs';
import { SearchPromptRequest } from './entity/request/SearchPromptRequest';
import { ImageResponseJson } from './entity/response/ImageResponseJson';

@Injectable()
export class ImageService {
  public constructor(
    private readonly imageRepository: ImageRepository,
    @Inject('ImageStorageService') private readonly imageStorageService: IImageStorageService,
    private readonly imageInteractRepository: ImageInteractionRepository,
    private readonly aiFeatureService: AIFeatureServiceManager,
  ) {}

  async handleUploadImages(
    userId: number,
    images: Express.Multer.File[],
  ): Promise<ImageResponseJson[]> {
    if (images == null) {
      throw new Exception(ImageError.IMAGES_LIST_EMPTY);
    }

    const result: ImageResponseJson[] = [];
    const image_upload_results: ImageUploadResult[] = await this.imageStorageService.uploadImages({
      images,
    });

    try {
      for (const image_upload of image_upload_results) {
        const image = await this.imageRepository.create({
          userId,
          url: image_upload.url,
          storageId: image_upload.id,
          type: ImageType.UPLOADED,
        });
        result.push(ImageResponse.convertFromImage(image).toJson());
      }

      return result;
    } catch (error) {
      throw new Exception(ImageError.UPLOAD_ERROR);
    }
  }

  async handleDeleteImages(imageIds: number[]): Promise<void> {
    for (const id of imageIds) {
      this.handleDeleteImage(id);
    }
  }

  async handleDeleteImage(id: number): Promise<void> {
    const image = await this.imageRepository.getById(id);

    if (!image) {
      throw new Exception(ImageError.IMAGE_NOT_FOUND);
    }

    await this.imageStorageService.deleteImage({ storageIds: image.storageId });
    await this.imageRepository.deleteById(id);
  }

  async handleGetImagesOfUser(userId: number): Promise<ImageResponseJson[]> {
    try {
      const images = await this.imageRepository.getByUserId(userId);
      const result: ImageResponseJson[] = images.map(image =>
        ImageResponse.convertFromImage(image).toJson(),
      );

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
  ): Promise<ImageResponse> {
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
  ): Promise<ImageResponse[]> {
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
  ): Promise<ImageResponse> {
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

  async handleGetGenerateImageHistory(user_id: number): Promise<ImageResponseJson[]> {
    const generatedImageTypes = [
      ImageType.IMG_TO_IMG,
      ImageType.TEXT_TO_IMG,
      ImageType.IMG_BY_IMAGES_STYLE,
    ];
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

  async handleImageProcessing(
    user_id: number,
    process_type: ProcessType,
    image_id: number,
  ): Promise<ImageResponseJson> {
    const image = await this.imageRepository.getById(image_id);

    if (!image) {
      throw new Exception(ImageError.IMAGE_NOT_FOUND);
    }

    if (!image.visibility && image.userId !== user_id) {
      throw new Exception(ImageError.FORBIDDEN_IMAGES);
    }

    switch (process_type) {
      case ProcessType.REMOVE_BACKGROUND:
        if (image.removeBackground) {
          throw new Exception(ImageError.IMAGE_REMOVED_BACKGROUD);
        }
        break;

      case ProcessType.UPSCALE:
        if (image.upscale) {
          throw new Exception(ImageError.IMAGE_UPSCALED);
        }
        break;
      default:
        throw new Exception(ImageError.INVALID_PROCESS_TYPE);
    }

    const image_buffer_input = await UrlUtil.urlImageToBuffer(image.url);

    let images_result_from_comfyui: Buffer[];
    switch (process_type) {
      case ProcessType.REMOVE_BACKGROUND:
        images_result_from_comfyui = await this.aiFeatureService.removeBackground(
          'comfyUI',
          image_buffer_input,
        );
        break;
      case ProcessType.UPSCALE:
        images_result_from_comfyui = await this.aiFeatureService.upscale(
          'comfyUI',
          image_buffer_input,
        );
        break;
      default:
        throw new Exception(ImageError.INVALID_PROCESS_TYPE);
    }

    const image_response = await this.handleUpdatePropertycorrespondingOfImage(
      process_type,
      image.id,
      images_result_from_comfyui[0],
    );

    return image_response;
  }

  async handleUpdatePropertycorrespondingOfImage(
    process_type: ProcessType,
    image_id: number,
    image_buffer: Buffer,
  ): Promise<ImageResponseJson> {
    const image_upload_result = await this.imageStorageService.uploadImageWithBuffer(image_buffer);

    let image;

    switch (process_type) {
      case ProcessType.REMOVE_BACKGROUND:
        image = await this.imageRepository.updateRemoveBackgroundImageById(
          image_id,
          image_upload_result.url,
        );
        break;
      case ProcessType.UPSCALE:
        image = await this.imageRepository.updateUpscaleImageById(
          image_id,
          image_upload_result.url,
        );
        break;
      default:
        throw new Exception(ImageError.INVALID_PROCESS_TYPE);
    }

    const image_response = ImageResponse.convertFromImage(image).toJson();

    return image_response;
  }

  async handleSearchPrompt(
    query_data: SearchPromptRequest,
  ): Promise<QueryPaginationResponse<ImageResponseJson>> {
    const pagination: QueryPagination = {
      page: query_data.page,
      limit: query_data.limit,
    };

    const images = await this.imageRepository.searchByPrompt(query_data.query, pagination);
    const result: ImageResponseJson[] = images.map(image =>
      ImageResponse.convertFromImage(image).toJson(),
    );
    const total_record = await this.imageRepository.countTotalRecordSeachByPrompt(query_data.query);
    return { page: query_data.page, limit: query_data.limit, data: result, total: total_record };
  }

  async handleGetImageById(image_id: number): Promise<ImageResponseJson> {
    const detail_image = await this.imageRepository.getById(image_id);

    if (!detail_image) {
      throw new Exception(ImageError.IMAGE_NOT_FOUND);
    }

    if (!detail_image.visibility) {
      throw new Exception(ImageError.CAN_NOT_VIEW_PRIVATE_IMAGE);
    }

    return ImageResponse.convertFromImage(detail_image).toJson();
  }

  async changeVisibilityImage(user_id: number, image_id: number): Promise<void> {
    const image = await this.imageRepository.getById(image_id);

    if (!image) {
      throw new Exception(ImageError.IMAGE_NOT_FOUND);
    }

    if (image.userId !== user_id) {
      throw new Exception(ImageError.FORBIDDEN_IMAGES);
    }

    const new_visibility = !image.visibility;

    try {
      await this.imageRepository.updateVisibilityById(image_id, new_visibility);
    } catch (error) {
      throw new Exception(ImageError.FAIL_TO_CHANGE_VISIBILITY);
    }
  }

  async handleGetImagesByUserId(
    user_id: number,
    pagination: QueryPagination,
  ): Promise<QueryPaginationResponse<ImageResponseJson>> {
    const images = await this.imageRepository.getByUserIdWithPaginition(user_id, true, pagination);

    const result: ImageResponseJson[] = images.map(image =>
      ImageResponse.convertFromImage(image).toJson(),
    );
    const total_count = await this.imageRepository.countTotalRecordByUserId(user_id, true);
    return {
      page: pagination.page,
      limit: pagination.limit,
      total: total_count,
      data: result,
    };
  }
}
