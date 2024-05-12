import * as RndString from 'randomstring';

export class RandomString {
  public static randomString(charset: string = 'alphabetic', length: number = 12): string {
    return RndString.generate({
      length,
      charset,
    });
  }
}
