import { get } from 'env-var';

export class MailConfig {
  public static readonly MAIL_HOST: string = get('MAIL_HOST').default('smtp.gmail.com').asString();
  public static readonly MAIL_PORT: string = get('MAIL_PORT').default('587').asString();
  public static readonly MAIL_USER: string = get('MAIL_USER')
    .default('artisticaihubs@gmail.com')
    .asString();
  public static readonly MAIL_PASSWORD: string = get('MAIL_PASSWORD')
    .default('ijfv ngjo dkre axdb')
    .asString();
  public static readonly MAIL_FROM: string = '"No Reply" <noreply@example.com>';
}
