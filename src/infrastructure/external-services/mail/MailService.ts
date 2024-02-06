import { MailerService } from '@nestjs-modules/mailer';

import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }
    async sendWelcomeMail(userEmail: string, subject: string, template: string, username: string): Promise<void> {
        await this.mailerService.sendMail({
            to: userEmail,
            subject: subject,
            template: template,
            context: {
                name: username,
            },
        });
    }
}
