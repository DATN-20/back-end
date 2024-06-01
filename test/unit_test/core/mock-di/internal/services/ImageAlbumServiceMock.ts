import { ImageAlbumService } from '@core/module/images-album/ImageAlbumService';

export const MockImageAlbumService: Partial<ImageAlbumService> = {
  getAllImagesInAlbum: jest.fn(),
};
