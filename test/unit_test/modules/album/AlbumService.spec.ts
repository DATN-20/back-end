import { Exception } from '@core/common/exception/Exception';
import { AlbumRepository } from '@core/module/album/AlbumRepository';
import { AlbumService } from '@core/module/album/AlbumService';
import { AlbumResponseJson } from '@core/module/album/entity/response/AlbumResponseJson';
import { AlbumWithImagesResponseJson } from '@core/module/album/entity/response/AlbumWithImagesResponseJson';
import { ImageResponse } from '@core/module/image/entity/response/ImageResponse';
import { ImageAlbumService } from '@core/module/images-album/ImageAlbumService';
import { UserRepository } from '@core/module/user/UserRepository';
import { MockAlbumRepository } from '@unittest/core/mock-di/internal/repositories/AlbumRepositoryMock';
import { MockUserRepository } from '@unittest/core/mock-di/internal/repositories/UserRepositoryMock';
import { MockImageAlbumService } from '@unittest/core/mock-di/internal/services/ImageAlbumServiceMock';
import { AlbumMock } from '@unittest/core/mock-entity/AlbumMock';
import { ImageMock } from '@unittest/core/mock-entity/ImageMock';
import { UserMock } from '@unittest/core/mock-entity/UserMock';
import { RandomString } from '@unittest/core/utils/RandomString';

describe(AlbumService.name, () => {
  let imageAlbumService: ImageAlbumService;
  let albumRepository: AlbumRepository;
  let userRepository: UserRepository;
  let albumService: AlbumService;
  let albumEntityMock: AlbumMock;
  let userEntityMock: UserMock;

  beforeAll(() => {
    userRepository = MockUserRepository as UserRepository;
    albumRepository = MockAlbumRepository as AlbumRepository;
    imageAlbumService = MockImageAlbumService as ImageAlbumService;

    albumService = new AlbumService(albumRepository, userRepository, imageAlbumService);
    albumEntityMock = new AlbumMock();
    userEntityMock = new UserMock();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('handleCreateNewAlbum', () => {
    it('should return new album', async () => {
      const album_entity = albumEntityMock.mock();
      const album_response_json: AlbumResponseJson = {
        id: album_entity.id,
        name: album_entity.name,
        created_at: album_entity.createdAt,
        updated_at: album_entity.updatedAt,
        created_user: {
          id: album_entity.userId,
          first_name: RandomString.randomString(),
          last_name: RandomString.randomString(),
          alias_name: RandomString.randomString(),
          avatar: null,
        },
      };
      jest.spyOn(albumRepository, 'create').mockResolvedValue(album_entity);
      const album_to_album_response_json_function = jest
        .spyOn(AlbumService.prototype as any, 'albumToAlbumResponseJson')
        .mockResolvedValue(album_response_json);

      const actual_result = await albumService.handleCreateNewAlbum(
        album_entity.userId,
        album_entity.name,
      );
      expect(album_to_album_response_json_function).toHaveBeenCalled();
      expect(actual_result).toEqual(album_response_json);
    });
  });

  describe('handleDeleteAlbums', () => {
    it('should delete albums matched ids', async () => {
      jest.spyOn(albumService, 'isAlbumOfUser').mockResolvedValue(true);
      await albumService.handleDeleteAlbums(1, [1, 2, 3]);
      expect(albumRepository.deleteById).toHaveBeenCalledTimes(3);
    });
  });

  describe('handleDeleteAlbum', () => {
    it('should delete album', async () => {
      jest.spyOn(albumService, 'isAlbumOfUser').mockResolvedValue(true);
      await albumService.handleDeleteAlbum(1, 1);
      expect(albumRepository.deleteById).toHaveBeenCalledWith(1);
      expect(albumRepository.deleteById).toHaveBeenCalled();
    });
  });

  describe('handleEditAlbum', () => {
    it('should return the updated album', async () => {
      const album_entity = albumEntityMock.mock();
      const album_response_json: AlbumResponseJson = {
        id: album_entity.id,
        name: 'test123',
        created_at: album_entity.createdAt,
        updated_at: album_entity.updatedAt,
        created_user: {
          id: album_entity.userId,
          first_name: RandomString.randomString(),
          last_name: RandomString.randomString(),
          alias_name: RandomString.randomString(),
          avatar: null,
        },
      };
      jest.spyOn(albumService, 'isAlbumOfUser').mockResolvedValue(true);
      jest.spyOn(albumRepository, 'update').mockResolvedValue({
        ...album_entity,
        name: 'test123',
      });
      const album_to_album_response_json_function = jest
        .spyOn(AlbumService.prototype as any, 'albumToAlbumResponseJson')
        .mockResolvedValue(album_response_json);
      const actual_result = await albumService.handleEditAlbum(
        album_entity.userId,
        album_entity.id,
        {
          name: 'test123',
        },
      );
      expect(actual_result).toEqual(album_response_json);
    });
  });

  describe('isAlbumOfUser', () => {
    it('should throw ALBUM_NOT_EXIST exception', async () => {
      jest.spyOn(albumRepository, 'getById').mockResolvedValue(null);

      await expect(albumService.isAlbumOfUser(1, 1)).rejects.toBeInstanceOf(Exception);
    });

    it('should throw NOT_OWNER_OF_ALBUM exception', async () => {
      const album_entity = albumEntityMock.mock();
      jest.spyOn(albumRepository, 'getById').mockResolvedValue(album_entity);

      await expect(
        albumService.isAlbumOfUser(album_entity.userId + 1, album_entity.id),
      ).rejects.toBeInstanceOf(Exception);
    });

    it('should return true', async () => {
      const album_entity = albumEntityMock.mock();
      jest.spyOn(albumRepository, 'getById').mockResolvedValue(album_entity);

      await expect(
        albumService.isAlbumOfUser(album_entity.userId, album_entity.id),
      ).resolves.toEqual(true);
    });
  });

  describe('handleGetFullInfo', () => {
    it('shoud return album with images response', async () => {
      const album_entities = albumEntityMock.mockArray(3);
      const araray_album_response_json: AlbumResponseJson[] = [];
      for (const album_entity of album_entities) {
        araray_album_response_json.push({
          id: album_entity.id,
          name: album_entity.name,
          created_at: album_entity.createdAt,
          updated_at: album_entity.updatedAt,
          created_user: {
            id: album_entity.userId,
            first_name: RandomString.randomString(),
            last_name: RandomString.randomString(),
            alias_name: RandomString.randomString(),
            avatar: null,
          },
        });
      }

      const expected_result: AlbumWithImagesResponseJson[] = [
        {
          album: araray_album_response_json[0],
          images: [],
        },
        {
          album: araray_album_response_json[1],
          images: [],
        },
        {
          album: araray_album_response_json[2],
          images: [],
        },
      ];
      jest.spyOn(albumRepository, 'getByUserId').mockResolvedValue(album_entities);
      jest
        .spyOn(imageAlbumService, 'getAllImagesInAlbum')
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const array_album_to_album_response_json_function = jest
        .spyOn(AlbumService.prototype as any, 'arrayAlbumsToAlbumResponseJson')
        .mockResolvedValue(araray_album_response_json);
      const actual_result = await albumService.handleGetFullInfo(1);
      expect(array_album_to_album_response_json_function).toHaveBeenCalled();
      expect(actual_result).toEqual(expected_result);
    });
  });

  describe('arrayAlbumsToAlbumResponseJson', () => {
    it('should return the album json', async () => {
      const user_entity = userEntityMock.mock();
      const album_entities = albumEntityMock.mockArray(3);
      const araray_album_response_json: AlbumResponseJson[] = [];
      for (const album_entity of album_entities) {
        araray_album_response_json.push({
          id: album_entity.id,
          name: album_entity.name,
          created_at: album_entity.createdAt,
          updated_at: album_entity.updatedAt,
          created_user: {
            id: album_entity.userId,
            first_name: user_entity.firstName,
            last_name: user_entity.lastName,
            alias_name: user_entity.aliasName,
            avatar: user_entity.avatar,
          },
        });
      }
      jest.spyOn(userRepository, 'getById').mockResolvedValue(user_entity);
      jest
        .spyOn(AlbumService.prototype as any, 'arrayAlbumsToAlbumResponseJson')
        .mockResolvedValue(araray_album_response_json);
      const actual_result = await albumService['arrayAlbumsToAlbumResponseJson'](album_entities);
      expect(actual_result).toEqual(araray_album_response_json);
    });
  });

  describe('albumToAlbumResponseJson', () => {
    it('should return the array album json', async () => {
      const user_entity = userEntityMock.mock();
      const album_entity = albumEntityMock.mock();
      const album_response_json: AlbumResponseJson = {
        id: album_entity.id,
        name: album_entity.name,
        created_at: album_entity.createdAt,
        updated_at: album_entity.updatedAt,
        created_user: {
          id: album_entity.userId,
          first_name: user_entity.firstName,
          last_name: user_entity.lastName,
          alias_name: user_entity.aliasName,
          avatar: user_entity.avatar,
        },
      };
      jest.spyOn(userRepository, 'getById').mockResolvedValue(user_entity);
      jest
        .spyOn(AlbumService.prototype as any, 'albumToAlbumResponseJson')
        .mockResolvedValue(album_response_json);
      const actual_result = await albumService['albumToAlbumResponseJson'](album_entity);
      expect(actual_result).toEqual(album_response_json);
    });
  });

  describe('handleViewAlbums', () => {
    it('should return array album response json', async () => {
      const user_entity = userEntityMock.mock();
      const album_entities = albumEntityMock.mockArray(3);
      const araray_album_response_json: AlbumResponseJson[] = [];
      for (const album_entity of album_entities) {
        araray_album_response_json.push({
          id: album_entity.id,
          name: album_entity.name,
          created_at: album_entity.createdAt,
          updated_at: album_entity.updatedAt,
          created_user: {
            id: album_entity.userId,
            first_name: user_entity.firstName,
            last_name: user_entity.lastName,
            alias_name: user_entity.aliasName,
            avatar: user_entity.avatar,
          },
        });
      }
      jest.spyOn(userRepository, 'getById').mockResolvedValue(user_entity);
      jest
        .spyOn(AlbumService.prototype as any, 'arrayAlbumsToAlbumResponseJson')
        .mockResolvedValue(araray_album_response_json);
      const actual_result = await albumService.handleViewAlbums(user_entity.id);
      expect(actual_result).toEqual(araray_album_response_json);
    });
  });
});
