import * as moment from 'moment';

export class DateUtil {
  public static formatDate(date: Date, pattern: string = 'DD-MM-YYYY HH:mm:ss'): string {
    return moment(date).format(pattern);
  }
}
