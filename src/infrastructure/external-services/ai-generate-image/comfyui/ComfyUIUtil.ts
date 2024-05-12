export class ComfyUIUtil {
  public static findIdByTitle(workflow: any, title: string): string {
    for (const id in workflow) {
      if (workflow[id]['_meta']['title'] === title) {
        return id;
      }
    }
  }

  public static appendWorkflow(original_workflow: any, new_workflow: any) {
    const updated_workflow = Object.assign({}, original_workflow, new_workflow);
    return updated_workflow;
  }

  public static getMaximumIdOfWorkflow(workflow: any): string {
    const keys_id = Object.keys(workflow);
    const max_key_id = Math.max(...keys_id.map(key => parseInt(key)));
    return max_key_id.toString();
  }
}
