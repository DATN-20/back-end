import { MailerService } from '@nestjs-modules/mailer';

import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }
    async sendMail(userEmail: string, subject: string, template: string, data: any): Promise<void> {
        await this.mailerService.sendMail({
            to: userEmail,
            subject: subject,
            template: template,
            context: {
                data,
            },
        });
    }
}
