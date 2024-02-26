import { get } from 'env-var';

export class ApiServerConfig {
  public static readonly HOST: string = get('API_HOST').asString();
  public static readonly PORT: number = get('API_PORT').asPortNumber() || 3000;
}
