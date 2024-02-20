import { GenerateInput } from './GenerateInput';

export class SliderInput extends GenerateInput {
  min: number;
  max: number;
  constructor(name: string, desc: string, defaultValue: any, min: number, max: number) {
    super(name, desc, defaultValue);
    this.typeName = 'text';
    this.max = max;
    this.min = min;
  }

  additionInfo(): any {
    return {
      max: this.max,
      min: this.min,
    };
  }
}
