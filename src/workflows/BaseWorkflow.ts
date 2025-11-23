import type { BaseNode } from "../nodes/BaseNode";

/**
 * Base Workflow class
 * 
 * @remarks
 * Represents a workflow containing a collection of nodes.
 * 
 * @category Workflows
 */
export class BaseWorkflow {
  public nodes: BaseNode[];
  constructor() {
    this.nodes = [];
  }

  public addNode(node: BaseNode) {
    this.nodes.push(node);
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