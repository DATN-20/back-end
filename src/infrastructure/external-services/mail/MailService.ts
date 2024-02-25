import { Exception } from '@core/common/exception/Exception';
import { MailError } from '@core/common/resource/error/MailError';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail<T>(user_email: string, subject: string, template: string, data: T): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user_email,
        subject: subject,
        template: template,
        context: {
          data,
        },
      });
    } catch (error) {
      throw new Exception(MailError.SEND_MAIL_FAILED);
    }
  }
}
