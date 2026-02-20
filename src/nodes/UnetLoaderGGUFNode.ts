import { BaseNode } from "./BaseNode";
import type { ModelProviderNode } from "./outputs/Providers";

/**
 * Unet Loader (GGUF) node
 *
 * @remarks
 * Loads a GGUF-quantised diffusion model. This is a custom node from
 * the ComfyUI-GGUF extension.
 *
 * @category Custom Nodes
 *
 * @example
 * ```typescript
 * const unetLoaderGGUF = new UnetLoaderGGUFNode({
 *   unet_name: "wan2.2_i2v_high_noise_14B_Q5_K_M.gguf"
 * });
 * ```
 */
export class UnetLoaderGGUFNode extends BaseNode implements ModelProviderNode {

  public readonly MODEL_OUTPUT = 0;

  public get MODEL(): number {
    return this.MODEL_OUTPUT;
  }

  constructor(options: {
    /** The GGUF model filename to load. */
    unet_name: string;
  }) {
    super("UnetLoaderGGUF", "Unet Loader (GGUF)", {
      unet_name: options.unet_name,
    });
  }
}
