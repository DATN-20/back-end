import { MailSubject } from '@core/common/enum/MailSubject';
import { MailTemplate } from '@core/common/enum/MailTemplate';
import { Exception } from '@core/common/exception/Exception';
import { MailError } from '@core/common/resource/error/MailError';
import { MailService } from '@infrastructure/external-services/mail/MailService';
import { MailerService as ExternalMailService } from '@nestjs-modules/mailer';
import { MockExternalMailService } from '@unittest/core/mock-di/external/MailServiceMock';

describe(MailService.name, () => {
  let externalMailService: ExternalMailService;
  let mailService: MailService;

  beforeAll(() => {
    externalMailService = MockExternalMailService as ExternalMailService;
    mailService = new MailService(externalMailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('sendMail', () => {
    it('should throw SEND_MAIL_FAILED exception', async () => {
      jest.spyOn(externalMailService, 'sendMail').mockImplementation(async () => {
        throw new Exception(MailError.SEND_MAIL_FAILED);
      });

      await expect(
        mailService.sendMail(
          'test@gmail.com',
          MailSubject.FORGET_PASSWORD,
          MailTemplate.FORGET_PASSWORD,
          {},
        ),
      ).rejects.toBeInstanceOf(Exception);
    });

    it('should send mail', async () => {
      jest.spyOn(externalMailService, 'sendMail').mockImplementation(jest.fn());

      await mailService.sendMail(
        'test@gmail.com',
        MailSubject.FORGET_PASSWORD,
        MailTemplate.FORGET_PASSWORD,
        {},
      );

      expect(externalMailService.sendMail).toBeCalledTimes(1);
    });
  });
});
