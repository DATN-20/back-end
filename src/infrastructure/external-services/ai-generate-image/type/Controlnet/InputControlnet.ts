import { AIOPreprocessorType } from './AIOPreprocessorType';
import { ControlnetNameEnum } from './ControlnetNameEnum';

export class InputControlnet {
  controlNetName: ControlnetNameEnum;
  image: string;
  preprocessor: AIOPreprocessorType;
}
