import { get } from 'env-var';

export class FrontEndConfig {
  public static readonly FRONT_END_URL: string = get('FRONT_END_URL')
    .default('http://localhost:3001')
    .asString();
  public static readonly URL_PATTERN_FORGET_PASSWORD: string = get(
    'URL_PATTERN_FORGET_PASSWORD',
  ).asString();
}
