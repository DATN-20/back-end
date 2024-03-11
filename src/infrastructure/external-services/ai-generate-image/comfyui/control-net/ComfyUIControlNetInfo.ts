export class ComfyUIControlNetInfo {
  private controlNetChoices: { [key: string]: string } = {
    t2idapter_depth: 't2iadapter_depth_sd14v1.pth',
    control_openpose: 'control_openpose-fp16.safetensors',
  };

  private controlNetName = 'ControlNet';
  private controlNetDesc = '';
}
