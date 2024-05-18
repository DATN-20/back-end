import { GenerateInput } from './GenerateInput';

export class ImageInput extends GenerateInput {
  private accept: string;

  constructor(
    name: string,
    desc: string,
    default_value: any,
    input_property_name: string,
    accept = 'image/*',
  ) {
    super(name, desc, default_value, input_property_name);
    this.typeName = 'image';
    this.accept = accept;
  }

  additionInfo() {
    return {
      accept: this.accept,
    };
  }
}
