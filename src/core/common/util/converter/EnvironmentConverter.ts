import { EnvironmentType } from '@core/common/enum/EvironmentType';
import { EnvironmentUtil } from '../EnvironmentUtil';

export class EnvironmentConverter {
  public static convertUrlInSuitableEnvironment(url: string): string {
    if (EnvironmentUtil.isDevMode()) {
      return `http://${url}`;
    }

    return `https://${url}`;
  }

  public static convertWebSocketInSuitableEnvironment(url: string): string {
    if (EnvironmentUtil.isDevMode()) {
      return `ws://${url}`;
    }

    return `wss://${url}`;
  }
}
