import { ArrayInputs } from '../../type/GenerateInput/ArrayInputs';
import { BooleanInput } from '../../type/GenerateInput/BooleanInput';
import { ChoiceInput } from '../../type/GenerateInput/ChoiceInput';
import { GenerateInput } from '../../type/GenerateInput/GenerateInput';
import { ImageInput } from '../../type/GenerateInput/ImageInput';
import { MultipleInputs } from '../../type/GenerateInput/MultipleInputs';
import { SliderInput } from '../../type/GenerateInput/SliderInput';
import { ControlNetType } from './types/ControlNetType';

export const CONTROL_NET_DEFAULT_STRENGTH = 1;

export class ComfyUIControlNetInfo {
  private controlNetStrengthName = 'Strength';
  private controlNetStrengthDesc =
    "Adjust the intensity of ControlNet's influence on the image generation. Higher values provide stronger control over structure and composition.";
  private controlNetStrengthMin = 0;
  private controlNetStrengthMax = 2;
  private controlNetStrengthDefault = CONTROL_NET_DEFAULT_STRENGTH;
  private controlNetStrengthStep = 0.1;
  private controlNetStrengthInputPropertyName = 'controlnetImageStrengths';
  public controlNetStrengthInput = new SliderInput(
    this.controlNetStrengthName,
    this.controlNetStrengthDesc,
    this.controlNetStrengthDefault,
    this.controlNetStrengthInputPropertyName,
    this.controlNetStrengthMin,
    this.controlNetStrengthMax,
    this.controlNetStrengthStep,
  );

  private controlNetTypeName = 'Type ControlNet';
  private controlNetTypeDesc =
    'Select the type of ControlNet model to use for guiding the image generation process.';
  private controlNetTypeChoices: { [key: string]: string } = {
    pose: ControlNetType.POSE,
    depth: ControlNetType.DEPTH,
    sketch: ControlNetType.SKETCH,
    color: ControlNetType.COLOR,
  };
  private controlNetTypeDefault = this.controlNetTypeChoices.pose;
  private controlNetTypeInputPropertyName = 'controlNetTypes';
  public controlNetTypeInput = new ChoiceInput(
    this.controlNetTypeName,
    this.controlNetTypeDesc,
    this.controlNetTypeDefault,
    this.controlNetTypeInputPropertyName,
    this.controlNetTypeChoices,
  );

  private controlNetPreprocessorName = 'Preprocessor';
  private controlNetPreprocessorDesc = 'This controlnet need preprocess or not?';
  private controlNetPreprocessorDefault = false;
  private controlNetPreprocessorInputPropertyName = 'controlnetIsPreprocessors';
  public controlNetPreprocessorInput = new BooleanInput(
    this.controlNetPreprocessorName,
    this.controlNetPreprocessorDesc,
    this.controlNetPreprocessorDefault,
    this.controlNetPreprocessorInputPropertyName,
  );

  private controlNetImageInputName = 'Image';
  private controlNetImageDesc = 'Image use for controlnet.';
  private controlNetImageDefault = null;
  private controlNetImageInputPropertyName = 'controlNetImages';
  public controlNetImageInput = new ImageInput(
    this.controlNetImageInputName,
    this.controlNetImageDesc,
    this.controlNetImageDefault,
    this.controlNetImageInputPropertyName,
  );

  private controlNetInputName = 'Apply ControlNet';
  private controlNetDesc =
    "Enable to apply ControlNet, a technique for precise control over the generated image's structure and composition.";
  private controlNetInputPropertyName = 'controlNets';
  private controlNetInputProps = [
    this.controlNetTypeInput,
    this.controlNetStrengthInput,
    this.controlNetImageInput,
    this.controlNetPreprocessorInput,
  ];
  public controlNetInput = new MultipleInputs(
    this.controlNetInputName,
    this.controlNetDesc,
    null,
    this.controlNetInputPropertyName,
    this.controlNetInputProps,
  );

  public inputs: { [key: string]: GenerateInput } = {
    controlNet: new ArrayInputs(
      this.controlNetInputName,
      this.controlNetDesc,
      [],
      this.controlNetInputPropertyName,
      this.controlNetInput,
    ),
  };
}
