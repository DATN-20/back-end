import { NotificationGateway } from '@infrastructure/socket/NotificationGataway';

export const MockNotificationGateway: Partial<NotificationGateway> = {
  handleSendNotification: jest.fn(),
};
