import { GenerationStatus } from '@core/common/enum/GenerationStatus';
import { Exception } from '@core/common/exception/Exception';
import { GenerationResponse } from '@core/module/generation/entity/response/GenerationResponse';
import { GenerationRepository } from '@core/module/generation/GenerationRepository';
import { GenerationService } from '@core/module/generation/GenerationService';
import { NotificationRepository } from '@core/module/notifications/NotificationRepository';
import { UserRepository } from '@core/module/user/UserRepository';
import { MailService } from '@infrastructure/external-services/mail/MailService';
import { NotificationGateway } from '@infrastructure/socket/NotificationGataway';
import { MockNotificationGateway } from '@unittest/core/mock-di/internal/gateways/NotificationGatewayMock';
import { MockGenerationRepository } from '@unittest/core/mock-di/internal/repositories/GenerationRepositoryMock';
import { MockNotificationRepository } from '@unittest/core/mock-di/internal/repositories/NotificationRepositoryMock';
import { MockUserRepository } from '@unittest/core/mock-di/internal/repositories/UserRepositoryMock';
import { MockMailService } from '@unittest/core/mock-di/internal/services/MailServiceMock';
import { GenerationMock } from '@unittest/core/mock-entity/GenerationMock';
import { NotificationMock } from '@unittest/core/mock-entity/NotificationMock';
import { UserMock } from '@unittest/core/mock-entity/UserMock';
import { RandomString } from '@unittest/core/utils/RandomString';

describe(GenerationService.name, () => {
  let generationService: GenerationService;
  let generationRepository: GenerationRepository;
  let mailService: MailService;
  let userRepository: UserRepository;
  let notificationRepository: NotificationRepository;
  let generationEntityMock: GenerationMock;
  let userEntityMock: UserMock;
  let notificationGateway: NotificationGateway;

  beforeAll(() => {
    mailService = MockMailService as MailService;
    notificationGateway = MockNotificationGateway as NotificationGateway;
    userRepository = MockUserRepository as UserRepository;
    notificationRepository = MockNotificationRepository as NotificationRepository;
    generationRepository = MockGenerationRepository as GenerationRepository;

    generationService = new GenerationService(
      generationRepository,
      mailService,
      userRepository,
      notificationRepository,
      notificationGateway,
    );
    generationEntityMock = new GenerationMock();
    userEntityMock = new UserMock();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('handleGetGenerationsOfUser', () => {
    it('should return generations of user', async () => {
      const generations = generationEntityMock.mockArray(5);
      jest.spyOn(generationRepository, 'getByUserId').mockResolvedValue(generations);

      await expect(
        generationService.handleGetGenerationsOfUser(generations[0].userId),
      ).resolves.toEqual(
        generations.map(generation => {
          return GenerationResponse.convertFromEntity(generation).toJson();
        }),
      );
    });
  });

  describe('handleGetGeneration', () => {
    it('should throw FORBIDDEN_VIEW_GENERATION exception', async () => {
      const generation = generationEntityMock.mock();
      generation.userId = 10;
      jest.spyOn(generationRepository, 'getById').mockResolvedValue(generation);

      await expect(generationService.handleGetGeneration(generation.id, 11)).rejects.toBeInstanceOf(
        Exception,
      );
    });

    it('should return detail generation', async () => {
      const generation = generationEntityMock.mock();
      jest.spyOn(generationRepository, 'getById').mockResolvedValue(generation);

      await expect(
        generationService.handleGetGeneration(generation.id, generation.userId),
      ).resolves.toEqual(GenerationResponse.convertFromEntity(generation).toJson());
    });
  });

  describe('handleCreateGenerationForUser', () => {
    it('should throw REACH_TO_MAXIMUM_TIMES exception', async () => {
      const generations = generationEntityMock.mockArray(3);
      jest.spyOn(generationRepository, 'getByUserId').mockResolvedValue(generations);

      await expect(
        generationService.handleCreateGenerationForUser(generations[0].userId),
      ).rejects.toBeInstanceOf(Exception);
    });

    it('should return a new generation', async () => {
      jest
        .spyOn(generationRepository, 'getByUserId')
        .mockResolvedValue(generationEntityMock.mockArray(1));
      const generation = generationEntityMock.mock();
      jest.spyOn(generationRepository, 'create').mockResolvedValue(generation);

      await expect(
        generationService.handleCreateGenerationForUser(generation.userId),
      ).resolves.toEqual(GenerationResponse.convertFromEntity(generation).toJson());
    });
  });

  describe('handleDeleteById', () => {
    it('should throw GENERATION_NOT_FOUND exception', async () => {
      jest.spyOn(generationRepository, 'getById').mockResolvedValue(null);
      await generationService.handleDeleteById(RandomString.randomString());

      expect(generationRepository.deleteById).not.toHaveBeenCalled();
    });

    it('should send mail to the owener of generation and delete generation', async () => {
      const generation = generationEntityMock.mock();
      jest.spyOn(generationRepository, 'getById').mockResolvedValue(generation);
      jest.spyOn(userRepository, 'getById').mockResolvedValue(userEntityMock.mock());

      await generationService.handleDeleteById(generation.id);
      expect(mailService.sendMail).toHaveBeenCalled();
      expect(generationRepository.deleteById).toHaveBeenCalled();
    });
  });

  describe('handleSendMailAndUpdate', () => {
    it('should send mail to the owner of generation and update generation', async () => {
      const generation = generationEntityMock.mock();
      const user = userEntityMock.mock();
      await generationService.handleSendMailAndUpdate(user, generation);
      expect(mailService.sendMail).toHaveBeenCalled();
      expect(generationRepository.updateIsSentMail).toHaveBeenCalled();
    });
  });

  describe('handleSendNotificationAndUpdate', () => {
    it('should notify to the owner of generation and update generation', async () => {
      const generation = generationEntityMock.mock();
      const user = userEntityMock.mock();
      const notification = new NotificationMock().mock();
      jest.spyOn(notificationRepository, 'create').mockResolvedValue(notification);
      await generationService.handleSendNotificationAndUpdate(user, generation);
      expect(notificationRepository.create).toHaveBeenCalled();
      expect(generationRepository.updateIsNotification).toHaveBeenCalled();
    });
  });

  describe('handleChangeStatusOfGeneration', () => {
    it('should throw GENERATION_NOT_FOUND exception', async () => {
      jest.spyOn(generationRepository, 'getById').mockResolvedValue(null);
      await expect(
        generationService.handleChangeStatusOfGeneration(
          RandomString.randomString(),
          GenerationStatus.PROCESSING,
        ),
      ).rejects.toBeInstanceOf(Exception);
    });

    it('should do nothing if new status is the same to the last times or finished or canceled', async () => {
      const generation = generationEntityMock.mock();
      jest.spyOn(generationRepository, 'getById').mockResolvedValue(generation);
      await generationService.handleChangeStatusOfGeneration(generation.id, generation.status);
    });

    it('should send mail and notification to the owner of generation', async () => {
      const generation = generationEntityMock.mock();
      const user = userEntityMock.mock();
      jest.spyOn(generationRepository, 'getById').mockResolvedValue(generation);
      const generation_after_updating = { ...generation };
      generation_after_updating.status = GenerationStatus.PROCESSING;
      jest.spyOn(userRepository, 'getById').mockResolvedValue(user);
      jest.spyOn(generationRepository, 'updateStatus').mockResolvedValue(generation_after_updating);
      jest.spyOn(generationService, 'handleSendMailAndUpdate').mockReturnValue(null);
      jest.spyOn(generationService, 'handleSendNotificationAndUpdate').mockReturnValue(null);

      await generationService.handleChangeStatusOfGeneration(
        generation.id,
        GenerationStatus.PROCESSING,
      );

      expect(generationService.handleSendMailAndUpdate).toHaveBeenCalled();
      expect(generationService.handleSendNotificationAndUpdate).toHaveBeenCalled();
      expect(generationRepository.deleteById).not.toHaveBeenCalled();
    });

    it('should send mail and notification to the owner of generation', async () => {
      const generation = generationEntityMock.mock();
      const user = userEntityMock.mock();
      jest.spyOn(generationRepository, 'getById').mockResolvedValue(generation);
      const generation_after_updating = { ...generation };
      generation_after_updating.status = GenerationStatus.FINISHED;
      jest.spyOn(userRepository, 'getById').mockResolvedValue(user);
      jest.spyOn(generationRepository, 'updateStatus').mockResolvedValue(generation_after_updating);
      jest.spyOn(generationService, 'handleSendMailAndUpdate').mockReturnValue(null);
      jest.spyOn(generationService, 'handleSendNotificationAndUpdate').mockReturnValue(null);

      await generationService.handleChangeStatusOfGeneration(
        generation.id,
        GenerationStatus.FINISHED,
      );

      expect(generationService.handleSendMailAndUpdate).toHaveBeenCalled();
      expect(generationService.handleSendNotificationAndUpdate).toHaveBeenCalled();
      expect(generationRepository.deleteById).toHaveBeenCalled();
    });
  });
});
