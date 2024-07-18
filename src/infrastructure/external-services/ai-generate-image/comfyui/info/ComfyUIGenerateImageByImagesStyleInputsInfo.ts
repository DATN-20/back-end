import { ArrayInputs } from '../../type/GenerateInput/ArrayInputs';
import { ChoiceInput } from '../../type/GenerateInput/ChoiceInput';
import { GenerateInput } from '../../type/GenerateInput/GenerateInput';
import { ImageInput } from '../../type/GenerateInput/ImageInput';
import { MultipleInputs } from '../../type/GenerateInput/MultipleInputs';
import { SliderInput } from '../../type/GenerateInput/SliderInput';
import { TextInput } from '../../type/GenerateInput/TextInput';
import { ComfyUIControlNetForIpadapterInfo } from '../control-net/ComfyUIControlNetForIpadapterInfo';

export class ComfyUIGenerateImageByImagesStyleInputsInfo {
  private positivePrompDesc =
    'Describe the elements or scene you want in the image. Be specific for better results.';
  private positivePrompName = 'Positive Prompt';
  private positivePrompPropertyName = 'positivePrompt';

  private negativePrompName = 'Negative Prompt';
  private negativePrompDesc = 'Specify elements or aspects you want to avoid in the image.';
  private negativePrompPropertyName = 'negativePrompt';

  private widthName = 'Width';
  private widthDesc = '';
  private widthMax = 1280;
  private widthMin = 64;
  private widthDefault = 512;
  private widthStep = 8;
  private widthInputPropertyName = 'width';

  private heightName = 'Height';
  private heightDesc = '';
  private heightMax = 1280;
  private heightMin = 64;
  private heightDefault = 512;
  private heightStep = 8;
  private heightInputPropertyName = 'height';

  private sizeName = 'Number of Image';
  private sizeDesc = 'Number of image you want to generate.';
  private sizeMin = 1;
  private sizeMax = 4;
  private sizeDefault = 1;
  private sizeStep = 1;
  private sizeInputPropertyName = 'numberOfImage';

  private seedDesc = '';
  private seedDefault = 0;
  private seedInputPropertyName = 'seed';

  private stepsName = 'Steps';
  private stepsDesc =
    'Set the number of iterations for generating the image. More steps can improve detail but take longer.';
  private stepMin = 1;
  private stepMax = 50;
  private stepDefault = 20;
  private stepStep = 1;
  private stepsInputPropertyName = 'steps';

  private samplerChoices: { [key: string]: string } = {
    Dpmpp_2m: 'dpmpp_2m',
    Dpmpp_2s_a: 'dpmpp_2s_ancestral',
  };
  private samplerDesc =
    'Choose the algorithm used to generate the image. Different methods can affect the style and quality.';
  private samplerName = 'Sampling Method';
  private samplerDefault = this.samplerChoices.Dpmpp_2m;
  private sampleMethosInputPropertyName = 'sampleMethos';

  private cfgName = 'CFG';
  private cfgDesc =
    'Adjust the strength of guidance for the prompt. Higher values can make the image more closely match the prompt.';
  private cfgMin = 1;
  private cfgMax = 30;
  private cfgDefault = 8;
  private cfgStep = 0.5;
  private cfgInputPropertyName = 'cfg';

  //unclip info
  private imageToUnclipsName = 'Image To Get Styles';
  private imageToUnclipsDesc = '';
  private imageToUnclipsInputPropertyName = 'imageToUnclips';

  private imageToUnclipNoiseAgementationName = 'Noise Agementation';
  private imageToUnclipNoiseAgementationDesc =
    'This mainly represents the closeness between the new image and the old image. 0 means the closest.';
  private imageToUnclipNoiseAgementationMin = 0;
  private imageToUnclipNoiseAgementationMax = 1;
  private imageToUnclipNoiseAgementationDefault = 0.1;
  private imageToUnclipNoiseAgementationStep = 0.01;
  private imageToUnclipNoiseAgementationInputPropertyName = 'imageToUnclipsNoiseAugmentation';

  public imageToUnclipNoiseAgementationInput = new SliderInput(
    this.imageToUnclipNoiseAgementationName,
    this.imageToUnclipNoiseAgementationDesc,
    this.imageToUnclipNoiseAgementationDefault,
    this.imageToUnclipNoiseAgementationInputPropertyName,
    this.imageToUnclipNoiseAgementationMin,
    this.imageToUnclipNoiseAgementationMax,
    this.imageToUnclipNoiseAgementationStep,
  );

  private imageToUnclipStrengthName = 'Strength';
  private imageToUnclipStrengthDesc =
    ' This sets the influence strength of the prompt. The larger the number, the closer it is to the description of the prompt..';
  private imageToUnclipStrengthMin = 0;
  private imageToUnclipStrengthMax = 2;
  private imageToUnclipStrengthDefault = 1;
  private imageToUnclipStrengthStep = 0.1;
  private imageToUnclipStrengthInputPropertyName = 'imageToUnclipsStrengths';
  public imageToUnclipStrengthInput = new SliderInput(
    this.imageToUnclipStrengthName,
    this.imageToUnclipStrengthDesc,
    this.imageToUnclipStrengthDefault,
    this.imageToUnclipStrengthInputPropertyName,
    this.imageToUnclipStrengthMin,
    this.imageToUnclipStrengthMax,
    this.imageToUnclipStrengthStep,
  );

  private imageToUnclipImageName = 'Image';
  private imageToUnclipImageDesc = '';
  private imageToUnclipImageInputPropertyName = 'imageToUnclipsImages';
  private imageToUnclipImageInput = new ImageInput(
    this.imageToUnclipImageName,
    this.imageToUnclipImageDesc,
    null,
    this.imageToUnclipImageInputPropertyName,
  );

  private imageToUnclipName = 'Image To Unclip';
  private imageToUnclipDesc = '';
  private imageToUnclipInputPropertyName = 'imageToUnclip';
  private imageToUnclipInputProps = [
    this.imageToUnclipImageInput,
    this.imageToUnclipStrengthInput,
    this.imageToUnclipNoiseAgementationInput,
  ];
  private imageToUnclipInput = new MultipleInputs(
    this.imageToUnclipName,
    this.imageToUnclipDesc,
    null,
    this.imageToUnclipInputPropertyName,
    this.imageToUnclipInputProps,
  );
  //end of unclip info

  //ipdapter info

  private imageForIpadapterWeightName = 'Weight';
  private imageForIpadapterWeightDesc = 'This represents the weight assigned to the image adapter.';
  private imageForIpadapterWeightMin = 0;
  private imageForIpadapterWeightMax = 1;
  private imageForIpadapterWeightDefault = 1;
  private imageForIpadapterWeightStep = 0.01;
  private imageForIpadapterWeightInputPropertyName = 'imageForIpadapterWeight';

  public imageForIpadapterWeightInput = new SliderInput(
    this.imageForIpadapterWeightName,
    this.imageForIpadapterWeightDesc,
    this.imageForIpadapterWeightDefault,
    this.imageForIpadapterWeightInputPropertyName,
    this.imageForIpadapterWeightMin,
    this.imageForIpadapterWeightMax,
    this.imageForIpadapterWeightStep,
  );

  private cropPositionChoices: { [key: string]: string } = {
    Center: 'center',
    Top: 'top',
    Bottom: 'bottom',
    Left: 'left',
    Right: 'right',
    Pad: 'pad',
  };

  private cropPositionDesc = 'Crop the image.';
  private cropPositionName = 'Crop Position';
  private cropPositionDefault = this.cropPositionChoices.Center;
  private cropPositionInputPropertyName = 'imageForIPAdapterCropPosition';

  public imageForIpadapterCropPositionInput = new ChoiceInput(
    this.cropPositionName,
    this.cropPositionDesc,
    this.cropPositionDefault,
    this.cropPositionInputPropertyName,
    this.cropPositionChoices,
  );

  private imageForIpadapterName = 'Image';
  private imageForIpadapterDesc = '';
  private imageForIpadapterInputPropertyName = 'imageForIpadapter';
  private imageForIpadapterAccepted = '.png';
  private imageForIpadapterInput = new ImageInput(
    this.imageForIpadapterName,
    this.imageForIpadapterDesc,
    null,
    this.imageForIpadapterInputPropertyName,
    this.imageForIpadapterAccepted,
  );

  private imageDataForIpadapterName = 'Image To Get Styles';
  private imageDataForIpadapterDesc = '';
  private imageDataForIpadapterInputPropertyName = 'ipadapterStyleTranferInputs';

  private imageDataForIpadapterInputProps = [
    this.imageForIpadapterInput,
    this.imageForIpadapterWeightInput,
    this.imageForIpadapterCropPositionInput,
  ];
  private imageDataForIpadapterInput = new MultipleInputs(
    this.imageDataForIpadapterName,
    this.imageDataForIpadapterDesc,
    null,
    this.imageDataForIpadapterInputPropertyName,
    this.imageDataForIpadapterInputProps,
  );
  //end of adapter info

  public inputs: { [key: string]: GenerateInput } = {
    positivePrompt: new TextInput(
      this.positivePrompName,
      this.positivePrompDesc,
      '',
      this.positivePrompPropertyName,
    ),
    negativePrompt: new TextInput(
      this.negativePrompName,
      this.negativePrompDesc,
      '',
      this.negativePrompPropertyName,
    ),
    width: new SliderInput(
      this.widthName,
      this.widthDesc,
      this.widthDefault,
      this.widthInputPropertyName,
      this.widthMin,
      this.widthMax,
      this.widthStep,
    ),
    height: new SliderInput(
      this.heightName,
      this.heightDesc,
      this.heightDefault,
      this.heightInputPropertyName,
      this.heightMin,
      this.heightMax,
      this.heightStep,
    ),
    size: new SliderInput(
      this.sizeName,
      this.sizeDesc,
      this.sizeDefault,
      this.sizeInputPropertyName,
      this.sizeMin,
      this.sizeMax,
      this.sizeStep,
    ),
    steps: new SliderInput(
      this.stepsName,
      this.stepsDesc,
      this.stepDefault,
      this.stepsInputPropertyName,
      this.stepMin,
      this.stepMax,
      this.stepStep,
    ),
    sampler: new ChoiceInput(
      this.samplerName,
      this.samplerDesc,
      this.samplerDefault,
      this.sampleMethosInputPropertyName,
      this.samplerChoices,
    ),
    cfg: new SliderInput(
      this.cfgName,
      this.cfgDesc,
      this.cfgDefault,
      this.cfgInputPropertyName,
      this.cfgMin,
      this.cfgMax,
      this.cfgStep,
    ),
    // imageToUnclipsName: new ArrayInputs(
    //   this.imageToUnclipsName,
    //   this.imageToUnclipsDesc,
    //   [],
    //   this.imageToUnclipsInputPropertyName,
    //   this.imageToUnclipInput,
    // ),
    ipadapterStyleTranferInputs: new ArrayInputs(
      this.imageDataForIpadapterName,
      this.imageDataForIpadapterDesc,
      [],
      this.imageDataForIpadapterInputPropertyName,
      this.imageDataForIpadapterInput,
    ),

    controlNets: new ComfyUIControlNetForIpadapterInfo().inputs.controlNet,
  };
}
