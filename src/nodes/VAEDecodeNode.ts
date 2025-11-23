import { BaseNode } from "./BaseNode";
import type { VaeProviderNode, DecodedImageProviderNode, LatentImageProviderNode } from "./outputs/Providers";

export class VAEDecodeNode extends BaseNode implements DecodedImageProviderNode {

  public readonly IMAGE_OUTPUT = 0;

  public get IMAGE(): number {
    return this.IMAGE_OUTPUT;
  }

  constructor(options: {
    samples: LatentImageProviderNode,
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