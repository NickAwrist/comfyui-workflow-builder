import { BaseNode } from "./BaseNode";
import type { LatentImageProviderNode } from "./outputs/Providers";

/**
 * Empty Latent Image node
 * 
 * @remarks
 * This node creates an empty latent image for use in other nodes.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const emptyLatentImageNode = new EmptyLatentImageNode();
 * ```
 */
export class EmptyLatentImageNode extends BaseNode implements LatentImageProviderNode {

  public readonly LATENT_IMAGE_OUTPUT = 0;

  public get LATENT_IMAGE(): number {
    return this.LATENT_IMAGE_OUTPUT;
  }

  constructor(options?: {
    /** The width of the latent image. Defaults to 512. */
    width?: number,
    /** The height of the latent image. Defaults to 512. */
    height?: number,
    /** The batch size of the latent image. Defaults to 1. */
    batch_size?: number
  }) {
    super("EmptyLatentImage", "Empty Latent Image", {
      width: options?.width ?? 512,
      height: options?.height ?? 512,
      batch_size: options?.batch_size ?? 1
    });
  }
}