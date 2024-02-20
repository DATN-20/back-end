import { GenerateInput } from './GenerateInput';

export class BooleanInput extends GenerateInput {
  constructor(name: string, desc: string, defaultValue: any) {
    super(name, desc, defaultValue);
    this.typeName = 'boolean';
  }
}
