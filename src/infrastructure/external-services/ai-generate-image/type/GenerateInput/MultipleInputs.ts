import { GenerateInput } from './GenerateInput';

export class MultipleInputs extends GenerateInput {
  inputs: GenerateInput[];

  constructor(
    name: string,
    desc: string,
    default_value: any,
    input_property_name: string,
    inputs: GenerateInput[],
  ) {
    super(name, desc, default_value, input_property_name);
    this.typeName = 'multiple';
    this.inputs = inputs;
  }

  private inputsJsonData() {
    const result = Object.values(this.inputs).map(input => JSON.parse(input.toJson()));
    return result;
  }

  additionInfo(): any {
    return {
      inputs: this.inputsJsonData(),
    };
  }
}
