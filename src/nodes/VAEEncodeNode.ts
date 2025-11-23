import { BaseNode } from "./BaseNode";
import type { OutputsLatentImage, VaeProviderNode } from "./outputs/Providers";
import type { DecodedImageProviderNode } from "./outputs/Providers";

/**
 * VAEEncode node
 * 
 * @remarks
 * This node encodes an image using the VAE.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const vaeEncodeNode = new VAEEncodeNode({
 *   pixels: decodedImageNode,
 *   vae: vaeNode
 * });
 * ```
 */
export class VAEEncodeNode extends BaseNode implements OutputsLatentImage {
  public readonly LATENT_IMAGE_OUTPUT = 0;

  public get LATENT_IMAGE(): number {
    return this.LATENT_IMAGE_OUTPUT;
  }

  constructor(options: {
    /** The image to encode. */
    pixels: DecodedImageProviderNode,
    /** The VAE to use for encoding. */
    vae: VaeProviderNode
  }) {
    super("VAEEncode", "VAEEncode", {
      pixels: [
        options.pixels.node_id,
        options.pixels.IMAGE
      ],
      vae: [
        options.vae.node_id,
        options.vae.VAE
      ]
    });
  }

}
