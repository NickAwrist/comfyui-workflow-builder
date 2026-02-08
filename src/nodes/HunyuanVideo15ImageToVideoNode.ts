import { BaseNode } from "./BaseNode";
import type {
  ClipVisionEncodedProviderNode,
  ConditioningProviderNode,
  DecodedImageProviderNode,
  OutputsLatentImage,
  OutputsNegativeConditioning,
  OutputsPositiveConditioning,
  VaeProviderNode,
} from "./outputs/Providers";

/**
 * HunyuanVideo 1.5 Image to Video node
 *
 * @remarks
 * This node prepares conditioning and latent inputs for HunyuanVideo 1.5 image-to-video generation.
 * It outputs positive conditioning (0), negative conditioning (1), and a latent image (2).
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const hunyuanI2V = new HunyuanVideo15ImageToVideoNode({
 *   positive: positivePromptNode,
 *   negative: negativePromptNode,
 *   vae: vaeNode,
 *   start_image: loadImageNode,
 *   clip_vision_output: clipVisionEncodeNode
 * });
 * ```
 */
export class HunyuanVideo15ImageToVideoNode
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
    /** The width of the output. Defaults to 768. */
    width?: number;
    /** The height of the output. Defaults to 1024. */
    height?: number;
    /** The number of video frames. Defaults to 73. */
    length?: number;
    /** The batch size. Defaults to 1. */
    batch_size?: number;
    /** The positive conditioning input. */
    positive: ConditioningProviderNode;
    /** The negative conditioning input. */
    negative: ConditioningProviderNode;
    /** The VAE model. */
    vae: VaeProviderNode;
    /** The start image for image-to-video generation. */
    start_image: DecodedImageProviderNode;
    /** The CLIP Vision encoded output. */
    clip_vision_output: ClipVisionEncodedProviderNode;
  }) {
    super("HunyuanVideo15ImageToVideo", "HunyuanVideo15ImageToVideo", {
      width: options.width ?? 768,
      height: options.height ?? 1024,
      length: options.length ?? 73,
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
      clip_vision_output: [
        options.clip_vision_output.node_id,
        options.clip_vision_output.CLIP_VISION_OUTPUT,
      ],
    });
  }
}
