import { InteractionType } from '@core/common/enum/InteractionType';
import { StringUtil } from '@core/common/util/StringUtil';

export class ImageMessage {
  public static DELETE_SUCCESS = 'Delete success';
  public static INTERACTION_IMAGE(type: InteractionType, uninteract: boolean): string {
    return uninteract
      ? `Un${type} image sucessfully!`
      : `${StringUtil.capitalize(type)} image sucessfully!`;
  }
  public static CHANGE_VISIBILITY_SUCCESS = 'Change visibility success';
}
