import { get } from 'env-var';

export class MailConfig {
    public static readonly MAIL_HOST: string = get('MAIL_HOST')
        .default('smtp.gmail.com')
        .asString();
    public static readonly MAIL_USER: string = get('MAIL_USER')
        .default('ai4artistt@gmail.com')
        .asString();
    public static readonly MAIL_PASSWORD: string = get('MAIL_PASSWORD')
        .default('uvck tdjl uqwb lfuz')
        .asString();
    public static readonly MAIL_FROM: string = get('MAIL_FROM')
        .default('ai4artist2gmail.com')
        .asString();
}
