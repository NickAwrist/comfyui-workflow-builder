export interface NodeInputs {
  [key: string]: any;
}

export interface NodeMeta {
  title: string;
}

/**
 * Base node class
 * 
 * @remarks
 * This class is abstract and should not be instantiated directly. 
 * It is used as a base class for all node classes.
 * 
 * @category Base
 * 
 * @example
 * ```typescript
 * class MyNode extends BaseNode {
 *   constructor() {
 *     super("my_node", "My Node", { input: "string" });
 *   }
 * }
 * ```
 */
export abstract class BaseNode {

  private static _node_id: number = 0;

  /**
   * Resets the node ID counter. Useful for testing.
   */
  public static resetNodeId(): void {
    BaseNode._node_id = 0;
  }

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