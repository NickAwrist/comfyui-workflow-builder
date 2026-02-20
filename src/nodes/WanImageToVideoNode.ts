import { BaseNode } from "./BaseNode";
import type {
  ConditioningProviderNode,
  DecodedImageProviderNode,
  OutputsLatentImage,
  OutputsNegativeConditioning,
  OutputsPositiveConditioning,
  VaeProviderNode,
} from "./outputs/Providers";

/**
 * WanImageToVideo node
 *
 * @remarks
 * Prepares conditioning and latent inputs for Wan2.2 image-to-video generation.
 * Outputs positive conditioning (0), negative conditioning (1), and a latent image (2).
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const wanI2V = new WanImageToVideoNode({
 *   width: 1024,
 *   height: 1024,
 *   length: 65,
 *   positive: positivePromptNode,
 *   negative: negativePromptNode,
 *   vae: vaeNode,
 *   start_image: loadImageNode,
 * });
 * ```
 */
export class WanImageToVideoNode
  extends BaseNode
  implements OutputsPositiveConditioning, OutputsNegativeConditioning, OutputsLatentImage
{
  public readonly POSITIVE_CONDITIONING_OUTPUT = 0;
  public readonly NEGATIVE_CONDITIONING_OUTPUT = 1;
  public readonly LATENT_IMAGE_OUTPUT = 2;

  public get POSITIVE_CONDITIONING(): number {
    return this.POSITIVE_CONDITIONING_OUTPUT;
  }

  public get NEGATIVE_CONDITIONING(): number {
    return this.NEGATIVE_CONDITIONING_OUTPUT;
  }

  public get LATENT_IMAGE(): number {
    return this.LATENT_IMAGE_OUTPUT;
  }

  constructor(options: {
    /** Output width. Defaults to 1024. */
    width?: number;
    /** Output height. Defaults to 1024. */
    height?: number;
    /** Number of video frames. Defaults to 65. */
    length?: number;
    /** Batch size. Defaults to 1. */
    batch_size?: number;
    /** Positive conditioning input. */
    positive: ConditioningProviderNode;
    /** Negative conditioning input. */
    negative: ConditioningProviderNode;
    /** VAE model. */
    vae: VaeProviderNode;
    /** Start image for image-to-video generation. */
    start_image: DecodedImageProviderNode;
  }) {
    super("WanImageToVideo", "WanImageToVideo", {
      width: options.width ?? 1024,
      height: options.height ?? 1024,
      length: options.length ?? 65,
      batch_size: options.batch_size ?? 1,
      positive: [
        options.positive.node_id,
        options.positive.CONDITIONING,
      ],
      negative: [
        options.negative.node_id,
        options.negative.CONDITIONING,
      ],
      vae: [
        options.vae.node_id,
        options.vae.VAE,
      ],
      start_image: [
        options.start_image.node_id,
        options.start_image.IMAGE,
      ],
    });
  }
}
