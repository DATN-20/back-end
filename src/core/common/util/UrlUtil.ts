import axios from 'axios';
import { Exception } from '../exception/Exception';
import { ErrorBaseSystem } from '../resource/error/ErrorBase';

export class UrlUtil {
  // check the string is url of image or base64 content: true -> url, false -> base64
  public static isUrlImage(value: string): boolean {
    const regexUrl = /^(ftp|http|https):\/\/[^ "]+$/;

    return regexUrl.test(value);
  }

  public static async urlImageToBuffer(url_image: string): Promise<Buffer> {
    try {
      const response = await axios.get(url_image, { responseType: 'arraybuffer' });

      if (response.status === 200) {
        return Buffer.from(response.data, 'binary');
      } else {
        throw new Exception(ErrorBaseSystem.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      throw new Exception(ErrorBaseSystem.INTERNAL_SERVER_ERROR);
    }
  }
}
