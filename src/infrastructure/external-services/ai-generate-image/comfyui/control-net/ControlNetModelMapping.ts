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
    [ControlNetType.POSE_SDXL]: ControlnetNameEnum.T2IADAPTER_OPENPOSE_SDXL,
    [ControlNetType.SKETCH_SDXL]: ControlnetNameEnum.T2IADAPTER_SKETCH_SDXL,
    [ControlNetType.DEPTH_SDXL]: ControlnetNameEnum.T2IADAPTER_DEPTH_SDXL,
    [ControlNetType.CANNY_SDXL]: ControlnetNameEnum.T2IADAPTER_CANNY_SDXL,
    [ControlNetType.LINEART_SDXL]: ControlnetNameEnum.T2IADAPTER_LINEAR_SDXL,
  };

  private AIOProcessors = {
    pose: AIOPreprocessorType.POSE,
    sketch: AIOPreprocessorType.SKETCH,
    depth: AIOPreprocessorType.DEPTH,
    color: AIOPreprocessorType.COLOR,
    [ControlNetType.POSE_SDXL]: AIOPreprocessorType.POSE,
    [ControlNetType.SKETCH_SDXL]: AIOPreprocessorType.SKETCH,
    [ControlNetType.DEPTH_SDXL]: AIOPreprocessorType.DEPTH,
    [ControlNetType.CANNY_SDXL]: AIOPreprocessorType.CANNY,
    [ControlNetType.LINEART_SDXL]: AIOPreprocessorType.LINEART,
  };

  getControlNet(type: ControlNetType): ControlnetNameEnum {
    return this.controlNets[`${type}`];
  }

  getAIOPreprocessor(type: ControlNetType): AIOPreprocessorType {
    return this.AIOProcessors[`${type}`];
  }
}
