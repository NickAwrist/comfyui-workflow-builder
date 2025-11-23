import { BaseNode } from "./BaseNode";
import type { OutputsLatentImage, VaeProviderNode } from "./outputs/Providers";
import type { ModelProviderNode } from "./outputs/Providers";
import type { DecodedImageProviderNode } from "./outputs/Providers";

export class VAEEncodeNode extends BaseNode implements OutputsLatentImage {
  public readonly LATENT_IMAGE_OUTPUT = 0;

  public get LATENT_IMAGE(): number {
    return this.LATENT_IMAGE_OUTPUT;
  }

  constructor(options: {
    pixels: DecodedImageProviderNode,
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
