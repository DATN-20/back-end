import { GenerateInput } from './GenerateInput';

export class ImageInput extends GenerateInput {
  constructor(name: string, desc: string, defaultValue: any) {
    super(name, desc, defaultValue);
    this.typeName = 'image';
  }
}
