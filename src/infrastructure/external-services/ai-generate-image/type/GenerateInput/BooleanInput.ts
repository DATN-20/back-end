import { GenerateInput } from './GenerateInput';

export class BooleanInput extends GenerateInput {
  constructor(name: string, desc: string, default_value: any, input_property_name: string) {
    super(name, desc, default_value, input_property_name);
    this.typeName = 'boolean';
  }
}
