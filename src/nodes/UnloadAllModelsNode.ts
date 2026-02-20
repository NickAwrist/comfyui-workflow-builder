import { BaseNode } from "./BaseNode";
import type { LatentImageProviderNode, OutputsLatentImage } from "./outputs/Providers";

/**
 * UnloadAllModels node
 *
 * @remarks
 * Passes through a latent value while signalling ComfyUI to unload all
 * models from memory. Useful for freeing VRAM before VAE decode.
 *
 * @category Custom Nodes
 *
 * @example
 * ```typescript
 * const unload = new UnloadAllModelsNode({
 *   value: samplerNode,
 * });
 * ```
 */
export class UnloadAllModelsNode extends BaseNode implements OutputsLatentImage {

  public readonly LATENT_IMAGE_OUTPUT = 0;

  public get LATENT_IMAGE(): number {
    return this.LATENT_IMAGE_OUTPUT;
  }

  constructor(options: {
    /** The latent value to pass through. */
    value: LatentImageProviderNode;
  }) {
    super("UnloadAllModels", "UnloadAllModels", {
      value: [
        options.value.node_id,
        options.value.LATENT_IMAGE,
      ],
    });
  }
}
