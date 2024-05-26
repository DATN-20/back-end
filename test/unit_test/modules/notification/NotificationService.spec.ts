import { NotificationRepository } from '@core/module/notifications/NotificationRepository';
import { NotificationService } from '@core/module/notifications/NotificationService';
import { NotifcationResponse } from '@core/module/notifications/entity/response/NotificationResponse';
import { NotificationMock } from '../../core/mock-entity/NotificationMock';
import { GetNotificationsQuery } from '@core/module/notifications/entity/request/GetNotificationsQuery';
import { Exception } from '@core/common/exception/Exception';
import { NotificationError } from '@core/common/resource/error/NotificationError';
import { MockNotificationRepository } from '@unittest/core/mock-di/internal/repositories/NotificationRepositoryMock';

describe(NotificationService.name, () => {
  let notificationService: NotificationService;
  let notificationRepository: NotificationRepository;
  let notificationEntityMock: NotificationMock;

  beforeAll(() => {
    notificationRepository = MockNotificationRepository as NotificationRepository;
    notificationService = new NotificationService(notificationRepository);
    notificationEntityMock = new NotificationMock();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('handleGetNotificationOfUser', () => {
    it('shoudl return list notification', async () => {
      const notifcations = notificationEntityMock.mockArray(5);
      const expected_result = notifcations.map(notifcation =>
        NotifcationResponse.convertFromEntity(notifcation).toJson(),
      );

      jest.spyOn(notificationRepository, 'getByUserId').mockResolvedValue(notifcations);
      await expect(
        notificationService.handleGetNotificationOfUser(
          notifcations[0].userId,
          {} as GetNotificationsQuery,
        ),
      ).resolves.toEqual(expected_result);
    });
  });

  describe('handleDeleteNotifications', () => {
    it('should delete all notification of specific user', async () => {
      jest
        .spyOn(notificationRepository, 'deleteAllOfUser')
        .mockImplementation(async (user_id: number) => {});

      await notificationService.handleDeleteNotifications(1);
      expect(notificationRepository.deleteAllOfUser).toHaveBeenCalledWith(1);
    });
  });

  describe('handleChangeStatusOfNotification', () => {
    it('shoud throw NOTIFICATION_NOT_FOUND exception', async () => {
      jest.spyOn(notificationRepository, 'getById').mockResolvedValue(null);

      await expect(notificationService.handleChangeStatusOfNotification(1, 1)).rejects.toThrowError(
        new Exception(NotificationError.NOTIFICATION_NOT_FOUND),
      );
    });

    it('shoud throw NOTIFICATION_NOT_FOUND exception', async () => {
      const notifcation = notificationEntityMock.mock();
      jest.spyOn(notificationRepository, 'getById').mockResolvedValue(notifcation);

      await expect(
        notificationService.handleChangeStatusOfNotification(1, notifcation.userId - 1),
      ).rejects.toThrowError(new Exception(NotificationError.FORBIDDEN_TO_TAKE_ACTION));
    });

    it('shoud throw NOTIFICATION_NOT_FOUND exception', async () => {
      const notifcation = notificationEntityMock.mock();
      jest.spyOn(notificationRepository, 'getById').mockResolvedValue(notifcation);
      jest.spyOn(notificationRepository, 'changeStatus').mockImplementation(jest.fn());
      await notificationService.handleChangeStatusOfNotification(
        notifcation.id,
        notifcation.userId,
      );
      expect(notificationRepository.changeStatus).toHaveBeenCalledWith(
        notifcation.id,
        !notifcation.isRead,
      );
    });
  });
});
