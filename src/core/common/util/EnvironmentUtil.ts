import { EnvironmentType } from '../enum/EvironmentType';

export class EnvironmentUtil {
  public static isDevMode(): boolean {
    return process.env.NODE_ENV === EnvironmentType.DEVELOPMENT;
  }
}
