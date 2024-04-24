import { Injectable } from '@nestjs/common';
import { AIOPreprocessorType } from './types/AIOPreprocessorType';
import { ControlNetType } from './types/ControlNetType';
import { ControlnetNameEnum } from './types/ControlnetNameEnum';

@Injectable()
export class ControlNetModelMapping {
  constructor() {}

  private controlNets = {
    pose: ControlnetNameEnum.OPEN_POSE,
    sketch: ControlnetNameEnum.SKETCH,
    depth: ControlnetNameEnum.T2IADAPTER_DEPTH,
    color: ControlnetNameEnum.COLOR,
  };

  private AIOProcessors = {
    pose: AIOPreprocessorType.POSE,
    sketch: AIOPreprocessorType.SKETCH,
    depth: AIOPreprocessorType.DEPTH,
    color: AIOPreprocessorType.COLOR,
  };

  getControlNet(type: ControlNetType): ControlnetNameEnum {
    return this.controlNets[`${type}`];
  }

  getAIOPreprocessor(type: ControlNetType): AIOPreprocessorType {
    return this.AIOProcessors[`${type}`];
  }
}
