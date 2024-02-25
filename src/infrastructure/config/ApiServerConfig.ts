import { get } from 'env-var';

export class ApiServerConfig {
  public static readonly HOST: string = get('API_HOST').default('localhost').asString();
  public static readonly PORT: number = get('API_PORT').default(3000).asPortNumber();
  public static readonly SERVER_URL: string = get('SERVER_URL')
    .default('http://localhost:3000')
    .asString();
}
