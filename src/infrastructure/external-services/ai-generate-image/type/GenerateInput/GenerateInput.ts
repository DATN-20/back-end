export class GenerateInput {
  name: string;
  default: any;
  typeName: string;
  desc: string;

  constructor(name: string, desc: string, default_value: string) {
    this.name = name;
    this.default = default_value;
  }

  additionInfo(): any {}

  toJson(): string {
    return JSON.stringify({
      name: this.name,
      type: this.typeName,
      desc: this.desc,
      default: this.default,
      info: this.additionInfo(),
    });
  }

  validate(val) {
    return true;
  }
}
