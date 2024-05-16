import { InputControlnet } from '../comfyui/control-net/types/InputControlnet';
import { IpadapterStyleTranferInput } from './Ipadapter/IpadapterStyleTranferInput';
import { ImageToUnclipInput } from './Unclip/ImageToUnClipInput';

export class GenerateByImagesStyleInputPromts {
  positivePrompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  numberOfImage: number;
  seed: number;
  steps: number;
  sampleMethos: string;
  cfg: number;
  noise: number;
  filename: string;
  controlNets: InputControlnet[];
  imageToUnclips: ImageToUnclipInput[];
  ipadapterStyleTranferInputs: IpadapterStyleTranferInput[];
  isUpscale: boolean;
  generationId: string;
}
