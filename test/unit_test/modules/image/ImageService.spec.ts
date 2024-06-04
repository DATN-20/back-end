import { Exception } from '@core/common/exception/Exception';
import { IImageStorageService } from '@core/common/interface/IImageStorageService';
import { ImageError } from '@core/common/resource/error/ImageError';
import { ImageRepository } from '@core/module/image/ImageRepository';
import { ImageService } from '@core/module/image/ImageService';
import { ImageInteractionRepository } from '@core/module/images-interaction/ImageInteractionRepository';
import { AIFeatureServiceManager } from '@infrastructure/external-services/ai-generate-image/AIFeatureServiceManager';
import { SINGLE_FILE_MOCK } from '../../core/utils/MockFile';
import { ImageMock } from '../../core/mock-entity/ImageMock';
import { ImageResponse } from '@core/module/image/entity/response/ImageResponse';
import { MockImageRepository } from '@unittest/core/mock-di/internal/repositories/ImageRepositoryMock';
import { MockImageStorageService } from '@unittest/core/mock-di/internal/services/ImageStorageServiceMock';
import { MockImageInteractionRepository } from '@unittest/core/mock-di/internal/repositories/ImageInteractionRepositoryMock';
import { InteractImageRequest } from '@core/module/image/entity/request/InteractImageRequest';
import { InteractionType } from '@core/common/enum/InteractionType';
import { ImageMessage } from '@core/common/resource/message/ImageMessage';
import { ImageInteractionMock } from '@unittest/core/mock-entity/ImageInteractionMock';
import { ImageType } from '@core/common/enum/ImageType';

describe(ImageService.name, () => {
  let imageService: ImageService;
  let imageRepository: ImageRepository;
  let imageStorageService: IImageStorageService;
  let imageInteractRepository: ImageInteractionRepository;
  let aiFeatureService: AIFeatureServiceManager;
  let imageEntityMock: ImageMock;
  let imageInteractionEntityMock: ImageInteractionMock;

  beforeAll(() => {
    imageRepository = MockImageRepository as ImageRepository;
    imageStorageService = MockImageStorageService as IImageStorageService;
    imageInteractRepository = MockImageInteractionRepository as ImageInteractionRepository;
    aiFeatureService = {} as AIFeatureServiceManager;
    imageEntityMock = new ImageMock();
    imageService = new ImageService(
      imageRepository,
      imageStorageService,
      imageInteractRepository,
      aiFeatureService,
    );
    imageInteractionEntityMock = new ImageInteractionMock();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('handleUploadImages', () => {
    it('should throw IMAGES_LIST_EMPTY exception', async () => {
      await expect(imageService.handleUploadImages(1, null)).rejects.toThrowError(
        new Exception(ImageError.IMAGES_LIST_EMPTY),
      );
    });

    it('should throw UPLOAD_ERROR exception', async () => {
      const image_upload_results = [
        {
          url: 'https://sdasdas.com/1.jpeg',
          id: '1',
        },
        {
          url: 'https://sdasdas.com/2.jpeg',
          id: '2',
        },
      ];
      const image_files = [SINGLE_FILE_MOCK, SINGLE_FILE_MOCK];
      jest.spyOn(imageStorageService, 'uploadImages').mockResolvedValue(image_upload_results);
      jest.spyOn(imageRepository, 'create').mockImplementation(() => {
        throw new Error('error');
      });

      await expect(imageService.handleUploadImages(1, image_files)).rejects.toThrowError(
        new Exception(ImageError.UPLOAD_ERROR),
      );
    });

    it('should return array image response json', async () => {
      const image_upload_results = [
        {
          url: 'https://sdasdas.com/1.jpeg',
          id: '1',
        },
        {
          url: 'https://sdasdas.com/2.jpeg',
          id: '2',
        },
      ];
      const image_files = [SINGLE_FILE_MOCK, SINGLE_FILE_MOCK];
      const image_1 = imageEntityMock.mock();
      image_1.url = image_upload_results[0].url;
      const image_2 = imageEntityMock.mock();
      image_2.url = image_upload_results[1].url;

      jest.spyOn(imageStorageService, 'uploadImages').mockResolvedValue(image_upload_results);
      jest
        .spyOn(imageRepository, 'create')
        .mockImplementationOnce(() => Promise.resolve(image_1))
        .mockImplementationOnce(() => Promise.resolve(image_2));

      await expect(imageService.handleUploadImages(1, image_files)).resolves.toEqual([
        ImageResponse.convertFromImage(image_1).toJson(),
        ImageResponse.convertFromImage(image_2).toJson(),
      ]);
    });
  });

  describe('handleDeleteImages', () => {
    it('should delete all image with ids', async () => {
      jest.spyOn(imageService, 'handleDeleteImage').mockImplementation(async (id: number) => {});
      await imageService.handleDeleteImages([1, 2, 3]);
      expect(imageService.handleDeleteImage).toBeCalledTimes(3);
    });
  });

  describe('handleDeleteImage', () => {
    it('should throw IMAGE_NOT_FOUND exception', async () => {
      jest.spyOn(imageRepository, 'getById').mockResolvedValue(null);

      await expect(imageService.handleDeleteImage(1)).rejects.toThrowError(
        new Exception(ImageError.IMAGE_NOT_FOUND),
      );
    });

    it('should delete image with id', async () => {
      const image = imageEntityMock.mock();
      jest.spyOn(imageRepository, 'getById').mockResolvedValue(image);
      jest
        .spyOn(imageStorageService, 'deleteImage')
        .mockImplementation(async (images: ImageDelete) => {});
      jest.spyOn(imageRepository, 'deleteById').mockImplementation(async (id: number) => {});

      await imageService.handleDeleteImage(image.id);

      expect(imageStorageService.deleteImage).toBeCalledTimes(1);
      expect(imageStorageService.deleteImage).toBeCalledWith({ storageIds: image.storageId });
      expect(imageRepository.deleteById).toBeCalledTimes(1);
      expect(imageRepository.deleteById).toBeCalledWith(image.id);
    });
  });

  describe('handleGetImagesOfUser', () => {
    it('should throw GET_ERROR exception', async () => {
      jest.spyOn(imageRepository, 'getByUserId').mockImplementation(async (id: number) => {
        throw new Error('error');
      });

      await expect(imageService.handleGetImagesOfUser(1)).rejects.toThrowError(
        new Exception(ImageError.GET_ERROR),
      );
    });

    it('should return list image of specific user', async () => {
      const image_1 = imageEntityMock.mock();
      const image_2 = imageEntityMock.mock();
      jest.spyOn(imageRepository, 'getByUserId').mockResolvedValue([image_1, image_2]);

      await expect(imageService.handleGetImagesOfUser(1)).resolves.toEqual([
        ImageResponse.convertFromImage(image_1).toJson(),
        ImageResponse.convertFromImage(image_2).toJson(),
      ]);
    });
  });

  describe('handleInteractImage', () => {
    let interactImageRequest: InteractImageRequest;
    beforeAll(() => {
      interactImageRequest = {
        imageId: 1,
        type: InteractionType.LIKE,
      };
    });

    it('should unlike the image if liked image before', async () => {
      jest.spyOn(imageInteractRepository, 'getPrimaryKey').mockResolvedValue(null);
      await expect(imageService.handleInteractImage(1, interactImageRequest)).resolves.toEqual(
        ImageMessage.INTERACTION_IMAGE(interactImageRequest.type, false),
      );
    });

    it('should like the image if do not like image before', async () => {
      const image_interaction = imageInteractionEntityMock.mock();
      jest.spyOn(imageInteractRepository, 'getPrimaryKey').mockResolvedValue(image_interaction);
      await expect(imageService.handleInteractImage(1, interactImageRequest)).resolves.toEqual(
        ImageMessage.INTERACTION_IMAGE(interactImageRequest.type, true),
      );
    });
  });

  describe('handleCreateGenerateImage', () => {
    it('should return image response json', async () => {
      const image_entity = imageEntityMock.mock();
      const image = SINGLE_FILE_MOCK;
      const image_upload_result = {
        url: 'https://sdasdas.com/1.jpeg',
        id: '1',
      };
      jest
        .spyOn(imageStorageService, 'uploadImageWithBuffer')
        .mockResolvedValue(image_upload_result);
      jest.spyOn(imageRepository, 'create').mockResolvedValue(image_entity);
      const actual_result = await imageService.handleCreateGenerateImage(
        1,
        image.buffer,
        ImageType.UPLOADED,
        {
          aiName: '',
          style: '',
          positivePrompt: '',
          negativePrompt: '',
          width: 0,
          height: 0,
          numberOfImage: 0,
          seed: 0,
          steps: 0,
          sampleMethos: '',
          cfg: 0,
          image: undefined,
          noise: 0,
          isUpscale: false,
          generationId: '',
          controlNetImages: [],
          controlnetImageStrengths: [],
          controlnetIsPreprocessors: [],
          controlNetTypes: [],
        },
        'abc',
      );

      expect(actual_result).toEqual(ImageResponse.convertFromImage(image_entity));
    });
  });
});
