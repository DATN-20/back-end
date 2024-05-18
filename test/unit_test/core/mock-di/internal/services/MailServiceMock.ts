import { MailService } from '@infrastructure/external-services/mail/MailService';

export const MockMailService: Partial<MailService> = {
  sendMail: jest.fn(),
};
