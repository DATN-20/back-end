import { EnvironmentType } from '@core/common/enum/EvironmentType';

export class EnvironmentConverter {
  public static convertUrlInSuitableEnvironment(url: string): string {
    if (process.env.NODE_ENV === EnvironmentType.DEVELOPMENT) {
      return `http://${url}`;
    }

    return `https://${url}`;
  }

  public static convertWebSocketInSuitableEnvironment(url: string): string {
    if (process.env.NODE_ENV === EnvironmentType.DEVELOPMENT) {
      return `ws://${url}`;
    }

    return `wss://${url}`;
  }
}
