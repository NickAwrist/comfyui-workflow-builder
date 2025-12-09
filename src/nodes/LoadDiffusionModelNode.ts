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
    diffusion_model_name: string
    weight_type?: string
  }) {
    super("UNETLoader", "Load Diffusion Model", {
      diffusion_model_name: options.diffusion_model_name,
      weight_type: options.weight_type ?? 'default'
    });
  }
}