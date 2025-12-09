import { BaseNode } from "./BaseNode";
import type { ConditioningProviderNode } from "./outputs/Providers";

/**
 * Conditioning Zero Out node
 * 
 * @remarks
 * This node zeros out the conditioning.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const conditioningZeroOutNode = new ConditioningZeroOutNode({
 *   conditioning: conditioningNode
 * });
 * ```
 */
export class ConditioningZeroOutNode extends BaseNode implements ConditioningProviderNode {

  public readonly CONDITIONING_OUTPUT = 0;

  public get CONDITIONING(): number {
    return this.CONDITIONING_OUTPUT;
  }

  constructor(options: {
    /** The conditioning to zero out. */
    conditioning: ConditioningProviderNode
  }) {
    super("ConditioningZeroOut", "Conditioning Zero Out", {
      conditioning: [
        options.conditioning.node_id,
        options.conditioning.CONDITIONING
      ]
    });
  }
}