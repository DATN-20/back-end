import { IImageStorageService } from '@core/common/interface/IImageStorageService';

export const MockImageStorageService: Partial<IImageStorageService> = {
  uploadImages: jest.fn(),
  deleteImage: jest.fn(),
  uploadImageWithBuffer: jest.fn(),
};
