import { GenerateInput } from './GenerateInput';

export class SliderInput extends GenerateInput {
  min: number;
  max: number;
  step: number;
  constructor(
    name: string,
    desc: string,
    defaultValue: any,
    min: number,
    max: number,
    step: number,
  ) {
    super(name, desc, defaultValue);
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
