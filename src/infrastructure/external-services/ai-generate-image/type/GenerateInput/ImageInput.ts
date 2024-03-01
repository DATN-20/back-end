import { GenerateInput } from './GenerateInput';

export class ImageInput extends GenerateInput {
  constructor(name: string, desc: string, default_value: any, input_property_name: string) {
    super(name, desc, default_value, input_property_name);
    this.typeName = 'image';
  }
}
