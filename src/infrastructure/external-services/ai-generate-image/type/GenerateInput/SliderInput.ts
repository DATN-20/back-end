import { GenerateInput } from './GenerateInput';

export class SliderInput extends GenerateInput {
  min: number;
  max: number;
  step: number;
  constructor(
    name: string,
    desc: string,
    default_value: any,
    min: number,
    max: number,
    step: number,
  ) {
    super(name, desc, default_value);
    this.typeName = 'text';
    this.max = max;
    this.min = min;
    this.step = step;
  }

  additionInfo(): any {
    return {
      max: this.max,
      min: this.min,
    };
  }

  validate(val) {
    if (val < this.min || val > this.max) {
      return false;
    }
  }
}
