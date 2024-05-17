import { MailerService as ExternalMailService } from '@nestjs-modules/mailer';

export const MockExternalMailService: Partial<ExternalMailService> = {
  sendMail: jest.fn(),
};
