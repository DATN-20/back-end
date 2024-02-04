import { ErrorBase } from '../resource/error/ErrorBase';

export class Exception extends Error {
  public readonly error: ErrorBase;

  public constructor(error: ErrorBase) {
    super();
    this.error = error;
  }
}
