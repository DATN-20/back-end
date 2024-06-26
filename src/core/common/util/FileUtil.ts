import * as fs from 'fs';
export class FileUtil {
  public static getBufferFromBase64(base64_data: string): Buffer {
    return Buffer.from(base64_data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  }

  public static writeLog(log: string): void {
    fs.appendFileSync('log.txt', `${log}\n`);
  }
}
