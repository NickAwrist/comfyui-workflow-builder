import { BaseNode } from "./BaseNode";
import type {
  ConditioningProviderNode,
  ModelProviderNode,
  NegativeConditioningProviderNode,
  OutputsGuider,
  PositiveConditioningProviderNode,
} from "./outputs/Providers";

/**
 * CFG Guider node
 *
 * @remarks
 * This node creates a classifier-free guidance guider for advanced sampling.
 * Accepts either standard `ConditioningProviderNode` or split
 * `PositiveConditioningProviderNode` / `NegativeConditioningProviderNode` inputs.
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const cfgGuider = new CFGGuiderNode({
 *   cfg: 6,
 *   model: modelNode,
 *   positive: hunyuanI2VNode,
 *   negative: hunyuanI2VNode
 * });
 * ```
 */
export class CFGGuiderNode extends BaseNode implements OutputsGuider {
  public readonly GUIDER_OUTPUT = 0;

  public get GUIDER(): number {
    return this.GUIDER_OUTPUT;
  }

  constructor(options: {
    /** The CFG scale. Defaults to 6. */
    cfg?: number;
    /** The model to guide. */
    model: ModelProviderNode;
    /** The positive conditioning input. */
    positive: ConditioningProviderNode | PositiveConditioningProviderNode;
    /** The negative conditioning input. */
    negative: ConditioningProviderNode | NegativeConditioningProviderNode;
  }) {
    const positiveIndex = "CONDITIONING" in options.positive
      ? (options.positive as ConditioningProviderNode).CONDITIONING
      : (options.positive as PositiveConditioningProviderNode).POSITIVE_CONDITIONING;

    const negativeIndex = "CONDITIONING" in options.negative
      ? (options.negative as ConditioningProviderNode).CONDITIONING
      : (options.negative as NegativeConditioningProviderNode).NEGATIVE_CONDITIONING;

    super("CFGGuider", "CFGGuider", {
      cfg: options.cfg ?? 6,
      model: [
        options.model.node_id,
        options.model.MODEL,
      ],
      positive: [
        options.positive.node_id,
        positiveIndex,
      ],
      negative: [
        options.negative.node_id,
        negativeIndex,
      ],
    });
  }
}
