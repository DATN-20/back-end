
import { Exception } from '@core/common/exception/Exception';
import { AuthError } from '@core/common/resource/error/AuthError';
import { MailError } from '@core/common/resource/error/MailError';
import { MailerService } from '@nestjs-modules/mailer';

import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }
    async sendMail(userEmail: string, subject: string, template: string, data: any): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: userEmail,
                subject: subject,
                template: template,
                context: {
                    data,
                },
            });
        } catch (error) {
            console.log(error);

        }

    }
}
