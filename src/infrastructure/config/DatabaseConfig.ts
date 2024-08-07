import { get } from 'env-var';

export class DatabaseConfig {
  public static readonly DATABASE_HOST: string = get('DATABASE_HOST')
    .default('127.0.0.1')
    .asString();
  public static readonly DATABASE_USER: string = get('DATABASE_USER').default('root').asString();
  public static readonly DATABASE_PORT: number = get('DATABASE_PORT').default(3306).asPortNumber();
  public static readonly DATABASE_PASSWORD: string = get('DATABASE_PASSWORD')
    .default('1234')
    .asString();
  public static readonly DATABASE_USER_ROOT: string = 'root';
  public static readonly DATABASE_PASSWORD_ROOT: string = 'datn191*11root';
  public static readonly DATABASE_NAME: string = get('DATABASE_NAME').default('artist').asString();
}
