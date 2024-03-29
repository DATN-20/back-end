import { GenerateInput } from './GenerateInput';

export class ChoiceInput extends GenerateInput {
  public choiceList: { [key: string]: string };
  constructor(
    name: string,
    desc: string,
    default_value: string,
    input_property_name: string,
    choice_list: { [key: string]: string },
  ) {
    super(name, desc, default_value, input_property_name);
    this.typeName = 'choice';
    this.choiceList = choice_list;
  }

  additionInfo() {
    return {
      choices: this.choiceList,
    };
  }

  validate(val: any): boolean {
    return Object.values(this.choiceList).includes(val);
  }
}
