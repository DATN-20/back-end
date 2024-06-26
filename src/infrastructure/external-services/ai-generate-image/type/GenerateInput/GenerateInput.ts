export abstract class GenerateInput {
  name: string;
  default: any;
  typeName: string;
  desc: string;
  inputPropertyName: string;

  constructor(name: string, desc: string, default_value: string, input_property_name: string) {
    this.name = name;
    this.default = default_value;
    this.inputPropertyName = input_property_name;
    this.desc = desc;
  }

  additionInfo(): any {}

  toJson(): string {
    return JSON.stringify({
      name: this.name,
      type: this.typeName,
      desc: this.desc,
      default: this.default,
      input_property_name: this.inputPropertyName,
      info: this.additionInfo(),
    });
  }

  validate(val: any): boolean {
    return true;
  }
}
