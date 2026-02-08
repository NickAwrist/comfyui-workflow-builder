import { BaseNode } from "./BaseNode";
import type { ModelProviderNode, OutputsModel } from "./outputs/Providers";

/**
 * Model Sampling SD3 node
 *
 * @remarks
 * This node applies SD3 model sampling with a configurable shift parameter.
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const modelSamplingSD3 = new ModelSamplingSD3Node({
 *   shift: 7,
 *   model: modelNode
 * });
 * ```
 */
export class ModelSamplingSD3Node extends BaseNode implements OutputsModel {
  public readonly MODEL_OUTPUT = 0;

  public get MODEL(): number {
    return this.MODEL_OUTPUT;
  }

  constructor(options: {
    /** The shift parameter. Defaults to 3. */
    shift?: number;
    /** The model to apply sampling to. */
    model: ModelProviderNode;
  }) {
    super("ModelSamplingSD3", "ModelSamplingSD3", {
      shift: options.shift ?? 3,
      model: [
        options.model.node_id,
        options.model.MODEL,
      ],
    });
  }
}
