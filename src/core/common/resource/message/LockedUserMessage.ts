import { DateUtil } from '@core/common/util/DateUtil';

export class LockedUserMessage {
  public static UNLOCKED_USER_SUCCESSFULLY = `User with %%id%% is unlocked at ${DateUtil.formatDate(
    new Date(),
  )}`;
}
