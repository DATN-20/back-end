import * as moment from 'moment';
import { DateUnit } from '../enum/DateUnit';

export class DateUtil {
  public static formatDate(date: Date, pattern: string = 'DD-MM-YYYY HH:mm:ss'): string {
    return moment(date).format(pattern);
  }

  public static addDate(start_date: Date, period: number, type: DateUnit): Date {
    return moment(start_date).add(period, type).toDate();
  }
}
