import { GenerateInput } from './GenerateInput';

export class ArrayInputs extends GenerateInput {
  element: GenerateInput;

  constructor(
    name: string,
    desc: string,
    default_value: any,
    input_property_name: string,
    element: GenerateInput,
  ) {
    super(name, desc, default_value, input_property_name);
    this.typeName = 'array';
    this.element = element;
  }

  additionInfo(): any {
    return {
      element: JSON.parse(this.element.toJson()),
    };
  }
}
