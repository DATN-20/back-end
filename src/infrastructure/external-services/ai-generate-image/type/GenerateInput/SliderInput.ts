import { GenerateInput } from './GenerateInput';

export class SliderInput extends GenerateInput {
  min: number;
  max: number;
  step: number;
  constructor(
    name: string,
    desc: string,
    default_value: any,
    input_property_name: string,
    min: number,
    max: number,
    step: number,
  ) {
    super(name, desc, default_value, input_property_name);
    this.typeName = 'slider';
    this.max = max;
    this.min = min;
    this.step = step;
  }

  additionInfo(): { max: number; min: number; step: number } {
    return {
      max: this.max,
      min: this.min,
      step: this.step,
    };
  }

  validate(val: any): boolean {
    if (val < this.min || val > this.max) {
      return false;
    } else {
      return true;
    }
  }
}
