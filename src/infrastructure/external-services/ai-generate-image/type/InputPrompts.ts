import { InputControlnet } from './Controlnet/InputControlnet';

export class InputPromts {
  style: string;
  positivePrompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  numberOfImage: number;
  seed: number;
  steps: number;
  sampleMethos: string;
  cfg: number;
  image: Express.Multer.File;
  noise: number;
  filename: string;
  controlNets: InputControlnet[];
  isUpscale: boolean;
}
