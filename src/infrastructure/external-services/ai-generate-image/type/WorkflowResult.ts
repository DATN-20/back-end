export interface WorkflowResultJson {
  workflow: any;
  output_id: string;
}

export class WorkflowResult {
  workflow: any;
  outputId: string;

  constructor(workflow: any, output_id: string | number) {
    this.workflow = workflow;
    this.outputId = output_id.toString();
  }

  public toJson(): WorkflowResultJson {
    return {
      workflow: this.workflow,
      output_id: this.outputId,
    };
  }
}
