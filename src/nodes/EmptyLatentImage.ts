import { BaseNode } from "./BaseNode";
import type { LatentImageProviderNode } from "./outputs/Providers";

export class EmptyLatentImageNode extends BaseNode implements LatentImageProviderNode {

  public readonly LATENT_IMAGE_OUTPUT = 0;

  public get LATENT_IMAGE(): number {
    return this.LATENT_IMAGE_OUTPUT;
  }

  constructor(options?: {
    width?: number,
    height?: number,
    batch_size?: number
  }) {
    super("EmptyLatentImage", "Empty Latent Image", {
      width: options?.width ?? 512,
      height: options?.height ?? 512,
      batch_size: options?.batch_size ?? 1
    });
  }
}