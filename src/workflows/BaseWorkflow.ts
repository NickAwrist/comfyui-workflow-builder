import type { BaseNode } from "../nodes/BaseNode";

export class BaseWorkflow {
  public nodes: BaseNode[];
  constructor() {
    this.nodes = [];
  }

  public addNode(node: BaseNode) {
    this.nodes.push(node);
  }

  public removeNode(node: BaseNode) {
    this.nodes = this.nodes.filter((n) => n !== node);
  }

  public getNodes(): BaseNode[] {
    return this.nodes;
  }

  workflow(): Record<string, any> {
    const output: Record<string, any> = {};

    for (const node of this.nodes) {
      const idString = node.node_id.toString();

      output[idString] = {
        inputs: node.inputs,
        class_type: node.class_type,
        _meta: node._meta
      };
    }

    return output;
  }
}