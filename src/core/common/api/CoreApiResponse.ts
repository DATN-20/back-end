import { ErrorBase } from '../resource/error/ErrorBase';

export class CoreApiRespons {
  public static success<TData>(data: TData) {
    return data;
  }

  public static error(data: ErrorBase) {
    return data;
  }
}
