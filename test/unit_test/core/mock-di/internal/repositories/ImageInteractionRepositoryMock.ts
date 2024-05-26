import { ImageInteractionRepository } from '@core/module/images-interaction/ImageInteractionRepository';

export const MockImageInteractionRepository: Partial<ImageInteractionRepository> = {
  getPrimaryKey: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
};
