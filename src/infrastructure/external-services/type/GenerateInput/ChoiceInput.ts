import { GenerateInput } from './GenerateInput';

export class Choice extends GenerateInput {
  constructor(name: string, desc: string, defaultValue: any) {
    super(name, desc, defaultValue);
    this.typeName = 'text';
  }
}
