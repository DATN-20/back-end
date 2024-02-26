import { ChoiceInput } from '../type/GenerateInput/ChoiceInput';
import { GenerateInput } from '../type/GenerateInput/GenerateInput';
import { ImageInput } from '../type/GenerateInput/ImageInput';
import { SliderInput } from '../type/GenerateInput/SliderInput';
import { TextInput } from '../type/GenerateInput/TextInput';

export class ComfyUIInfo {
  private styleChoices: { [key: string]: string } = {
    anime: 'anything_inkBase.safetensors',
  };

  private styleName = 'Style';
  private styleDesc = '';
  private styleDefault = this.styleChoices.anime;

  private positivePrompDesc = '';
  private positivePrompName = 'Positive Prompt';

  private negativePrompName = 'Negative Prompt';
  private negativePrompDesc = '';

  private widthName = 'Width';
  private widthDesc = '';
  private widthMax = 1024;
  private widthMin = 64;
  private widthDefault = 512;
  private widthStep = 8;

  private heightName = 'Height';
  private heightDesc = '';
  private heightMax = 1024;
  private heightMin = 64;
  private heightDefault = 512;
  private heightStep = 8;

  private sizeName = 'Number of Image';
  private sizeDesc = '';
  private sizeMin = 1;
  private sizeMax = 4;
  private sizeDefault = 1;
  private sizeStep = 1;

  private seedDesc = '';
  private seedDefault = 0;

  private stepsName = 'Steps';
  private stepsDesc = '';
  private stepMin = 1;
  private stepMax = 50;
  private stepDefault = 20;
  private stepStep = 1;

  private samplerChoices: { [key: string]: string } = {
    Euler: 'euler',
  };
  private samplerDesc = '';
  private samplerName = 'Sampling Method';
  private samplerDefault = this.samplerChoices.Euler;

  private cfgName = 'CFG';
  private cfgDesc = '';
  private cfgMin = 1;
  private cfgMax = 30;
  private cfgDefault = 8;
  private cfgStep = 0.5;

  private noiseName = 'CFG';
  private noiseDesc = '';
  private noiseMin = 0;
  private noiseMax = 1;
  private noiseDefault = 0.75;
  private noiseStep = 0.01;

  private imageName = 'Image';
  private imageDesc = '';
  public inputs: { [key: string]: GenerateInput } = {
    style: new ChoiceInput(this.styleName, this.styleDesc, this.styleDefault, this.styleChoices),
    positivePrompt: new TextInput(this.positivePrompName, this.positivePrompDesc, ''),
    negativePrompt: new TextInput(this.negativePrompName, this.negativePrompDesc, ''),
    width: new SliderInput(
      this.widthName,
      this.widthDesc,
      this.widthDefault,
      this.widthMin,
      this.widthMax,
      this.widthStep,
    ),
    height: new SliderInput(
      this.heightName,
      this.heightDesc,
      this.heightDefault,
      this.heightMin,
      this.heightMax,
      this.heightStep,
    ),
    size: new SliderInput(
      this.sizeName,
      this.sizeDesc,
      this.sizeDefault,
      this.sizeMin,
      this.sizeMax,
      this.sizeStep,
    ),
    steps: new SliderInput(
      this.stepsName,
      this.stepsDesc,
      this.stepDefault,
      this.stepMin,
      this.stepMax,
      this.stepStep,
    ),
    sampler: new ChoiceInput(
      this.samplerName,
      this.samplerDesc,
      this.samplerDefault,
      this.samplerChoices,
    ),
    cfg: new SliderInput(
      this.cfgName,
      this.cfgDesc,
      this.cfgDefault,
      this.cfgMin,
      this.cfgMax,
      this.cfgStep,
    ),

    noise: new SliderInput(
      this.noiseName,
      this.noiseDesc,
      this.noiseDefault,
      this.noiseMin,
      this.noiseMax,
      this.noiseStep,
    ),

    image: new ImageInput(this.imageName, this.imageDesc, null),
  };
}
