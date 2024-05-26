import { NotificationRepository } from '@core/module/notifications/NotificationRepository';

export const MockNotificationRepository: Partial<NotificationRepository> = {
  create: jest.fn(),
  getByUserId: jest.fn(),
  getById: jest.fn(),
  changeStatus: jest.fn(),
  deleteAllOfUser: jest.fn(),
};
