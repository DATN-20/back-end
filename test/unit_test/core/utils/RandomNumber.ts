export class RandomNumber {
  public static randomNumber(): number {
    return Math.random();
  }

  public static randomNumberWithRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
