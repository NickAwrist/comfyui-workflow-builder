import { BaseNode } from "./BaseNode";
import type { ModelProviderNode } from "./outputs/Providers";

/**
 * Model Sampling Aura Flow node
 * 
 * @remarks
 * This node samples from a model using the Model Sampling Aura Flow algorithm.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const modelSamplingAuraFlowNode = new ModelSamplingAuraFlowNode({
 *   shift: 3,
 *   model: modelNode
 * });
 * ```
 */
export class ModelSamplingAuraFlowNode extends BaseNode implements ModelProviderNode {

  public readonly MODEL_OUTPUT = 0;

  public get MODEL(): number {
    return this.MODEL_OUTPUT;
  }

  constructor(options: {
    /** The shift of the model. Defaults to 3. */
    shift?: number,
    /** The model to use. */
    model: ModelProviderNode
  }) {
    super("ModelSamplingAuraFlow", "Model Sampling Aura Flow", {
      shift: options.shift ?? 3,
      model: [
        options.model.node_id,
        options.model.MODEL
      ]
    });
  }
}