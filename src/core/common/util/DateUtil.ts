import * as moment from 'moment';
import { DateUnit } from '../enum/DateUnit';
import { Exception } from '../exception/Exception';
import { ErrorBaseSystem } from '../resource/error/ErrorBase';
import { UserManagementError } from '../resource/error/UserManagementError';
import { Moment } from 'moment';

export class DateUtil {
  public static formatDate(date: Date, pattern: string = 'DD-MM-YYYY HH:mm:ss'): string {
    return moment(date).format(pattern);
  }

  public static addDate(start_date: Date, period: number, type: DateUnit): Date {
    return moment(start_date).add(period, type).toDate();
  }

  public static subtractDate(start_date: Date, period: number, type: DateUnit): Date {
    return moment(start_date).subtract(period, type).toDate();
  }

  public static validateRangeDate(start_date: Date, end_date: Date): void {
    if (
      !(start_date instanceof Date) ||
      !(end_date instanceof Date) ||
      !moment(start_date).isValid() ||
      !moment(start_date).isValid()
    ) {
      throw new Exception(ErrorBaseSystem.VALIDATION_REQUEST_DATA_FAILED);
    }

    if (end_date < start_date) {
      throw new Exception(UserManagementError.END_DATE_LESS_THAN_START_DATE);
    }
  }

  public static endDate(): Moment {
    return moment().endOf('day');
  }
}
