export interface NodeInputs {
  [key: string]: any;
}

export interface NodeMeta {
  title: string;
}

export abstract class BaseNode {

  private static _node_id: number = 0;

  public inputs: NodeInputs;
  public class_type: string;
  public _meta?: NodeMeta;

  public readonly node_id: string;

  constructor(class_type: string, title: string, inputs: NodeInputs) {
    this.inputs = inputs;
    this.class_type = class_type;
    this._meta = {
      title: title
    };
    this.node_id = (BaseNode._node_id++).toString();
  }
}