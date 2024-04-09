export class StringUtil {
  public static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // check the string is url of image or base64 content: true -> url, false -> base64
  public static isUrlImage(value: string): boolean {
    const regexUrl = /^(ftp|http|https):\/\/[^ "]+$/;

    return regexUrl.test(value);
  }
}
