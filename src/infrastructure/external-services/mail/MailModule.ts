import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './MailService';
import { MailConfig } from '@infrastructure/config/MailConfig';


@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: MailConfig.MAIL_HOST,
                secure: true,
                auth: {
                    user: MailConfig.MAIL_USER,
                    pass: MailConfig.MAIL_PASSWORD,
                },
            },
            defaults: {
                from: '"No Reply" <noreply@example.com>',
            },
            template: {
                // dir: join(process.cwd(), '../templates'),
                dir: join(process.cwd(), 'src/infrastructure/external-services/mail/templates'),

                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
