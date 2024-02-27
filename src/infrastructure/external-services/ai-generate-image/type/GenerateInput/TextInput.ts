import { GenerateInput } from './GenerateInput';

export class TextInput extends GenerateInput {
  constructor(name: string, desc: string, default_value: any) {
    super(name, desc, default_value);
    this.typeName = 'text';
  }
}
