import { BaseNode } from "./BaseNode";
import type { ModelProviderNode } from "./outputs/Providers";

/**
 * Load Diffusion Model node
 * 
 * @remarks
 * This node loads a diffusion model.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const loadDiffusionModelNode = new LoadDiffusionModelNode({
 *   diffusion_model_name: "diffusion_model_name",
 *   weight_type: "default"
 * });
 * ```
 */
export class LoadDiffusionModelNode extends BaseNode implements ModelProviderNode {

  public readonly MODEL_OUTPUT = 0;

  public get MODEL(): number {
    return this.MODEL_OUTPUT;
  }

  constructor(options: {
    /** The name of the diffusion model to load. */
    unet_name: string
    weight_dtype?: string
  }) {
    super("UNETLoader", "Load Diffusion Model", {
      unet_name: options.unet_name,
      weight_dtype: options.weight_dtype ?? 'default'
    });
  }
}