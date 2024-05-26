import { ImageRepository } from '@core/module/image/ImageRepository';

export const MockImageRepository: Partial<ImageRepository> = {
  create: jest.fn(),
  getById: jest.fn(),
  deleteById: jest.fn(),
  getByUserId: jest.fn(),
};
