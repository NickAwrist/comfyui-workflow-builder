import { BaseNode } from "./BaseNode";
import type { VaeProviderNode, DecodedImageProviderNode, LatentImageProviderNode } from "./outputs/Providers";

/**
 * VAEDecode node
 * 
 * @remarks
 * This node decodes a latent image using the VAE.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const vaeDecodeNode = new VAEDecodeNode({
 *   samples: latentImageNode,
 *   vae: vaeNode
 * });
 * ```
 */
export class VAEDecodeNode extends BaseNode implements DecodedImageProviderNode {

  public readonly IMAGE_OUTPUT = 0;

  public get IMAGE(): number {
    return this.IMAGE_OUTPUT;
  }

  constructor(options: {
    /** The latent image to decode. */
    samples: LatentImageProviderNode,
    /** The VAE to use for decoding. */
    vae: VaeProviderNode
  }) {
    super("VAEDecode", "VAE Decode", {
      samples: [
        options.samples.node_id,
        options.samples.LATENT_IMAGE
      ],
      vae: [
        options.vae.node_id,
        options.vae.VAE
      ]
    });
  }
}