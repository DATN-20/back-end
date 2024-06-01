import { AlbumRepository } from '@core/module/album/AlbumRepository';

export const MockAlbumRepository: Partial<AlbumRepository> = {
  create: jest.fn(),
  deleteById: jest.fn(),
  update: jest.fn(),
  getById: jest.fn(),
  getByUserId: jest.fn(),
};
