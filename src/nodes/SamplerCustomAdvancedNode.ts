import { BaseNode } from "./BaseNode";
import type {
  GuiderProviderNode,
  LatentImageProviderNode,
  NoiseProviderNode,
  OutputsLatentImage,
  SamplerProviderNode,
  SigmasProviderNode,
} from "./outputs/Providers";

/**
 * Sampler Custom Advanced node
 *
 * @remarks
 * This node performs advanced custom sampling using separate noise, guider, sampler, and sigma inputs.
 * Outputs a latent image (0) and a denoised latent image (1).
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const samplerAdvanced = new SamplerCustomAdvancedNode({
 *   noise: randomNoiseNode,
 *   guider: cfgGuiderNode,
 *   sampler: kSamplerSelectNode,
 *   sigmas: basicSchedulerNode,
 *   latent_image: latentNode
 * });
 * ```
 */
export class SamplerCustomAdvancedNode extends BaseNode implements OutputsLatentImage {
  public readonly LATENT_IMAGE_OUTPUT = 0;
  public readonly DENOISED_OUTPUT = 1;

  public get LATENT_IMAGE(): number {
    return this.LATENT_IMAGE_OUTPUT;
  }

  constructor(options: {
    /** The noise input. */
    noise: NoiseProviderNode;
    /** The guider input. */
    guider: GuiderProviderNode;
    /** The sampler input. */
    sampler: SamplerProviderNode;
    /** The sigmas input. */
    sigmas: SigmasProviderNode;
    /** The latent image input. */
    latent_image: LatentImageProviderNode;
  }) {
    super("SamplerCustomAdvanced", "SamplerCustomAdvanced", {
      noise: [
        options.noise.node_id,
        options.noise.NOISE,
      ],
      guider: [
        options.guider.node_id,
        options.guider.GUIDER,
      ],
      sampler: [
        options.sampler.node_id,
        options.sampler.SAMPLER,
      ],
      sigmas: [
        options.sigmas.node_id,
        options.sigmas.SIGMAS,
      ],
      latent_image: [
        options.latent_image.node_id,
        options.latent_image.LATENT_IMAGE,
      ],
    });
  }
}
