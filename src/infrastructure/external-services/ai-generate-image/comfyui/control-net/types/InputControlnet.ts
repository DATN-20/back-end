import { ControlNetType } from './ControlNetType';

export class InputControlnet {
  controlNetType: ControlNetType;
  image: Buffer;
  isPreprocessor: boolean;
  strength: number;
}
