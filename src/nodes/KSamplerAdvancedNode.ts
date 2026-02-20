import { BaseNode } from "./BaseNode";
import type {
  ConditioningProviderNode,
  LatentImageProviderNode,
  ModelProviderNode,
  NegativeConditioningProviderNode,
  OutputsLatentImage,
  PositiveConditioningProviderNode,
} from "./outputs/Providers";

/**
 * KSampler (Advanced) node
 *
 * @remarks
 * Advanced KSampler that exposes add_noise, start/end step, and
 * return_with_leftover_noise controls for multi-pass sampling.
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const sampler = new KSamplerAdvancedNode({
 *   add_noise: "enable",
 *   noise_seed: 12345,
 *   steps: 4,
 *   cfg: 3,
 *   sampler_name: "euler",
 *   scheduler: "simple",
 *   start_at_step: 0,
 *   end_at_step: 2,
 *   return_with_leftover_noise: "enable",
 *   model: modelNode,
 *   positive: positiveNode,
 *   negative: negativeNode,
 *   latent_image: latentNode,
 * });
 * ```
 */
export class KSamplerAdvancedNode extends BaseNode implements OutputsLatentImage {

  public readonly LATENT_IMAGE_OUTPUT = 0;

  public get LATENT_IMAGE(): number {
    return this.LATENT_IMAGE_OUTPUT;
  }

  constructor(options: {
    /** Whether to add noise. "enable" or "disable". Defaults to "enable". */
    add_noise?: string;
    /** The noise seed. Defaults to a random value. */
    noise_seed?: number;
    /** Total number of sampling steps. Defaults to 20. */
    steps?: number;
    /** CFG scale. Defaults to 7. */
    cfg?: number;
    /** Sampler algorithm name. Defaults to "euler". */
    sampler_name?: string;
    /** Scheduler name. Defaults to "normal". */
    scheduler?: string;
    /** Step index to start sampling at. Defaults to 0. */
    start_at_step?: number;
    /** Step index to end sampling at. Defaults to the value of steps. */
    end_at_step?: number;
    /** Whether to return with leftover noise. "enable" or "disable". Defaults to "disable". */
    return_with_leftover_noise?: string;
    /** The model to sample from. */
    model: ModelProviderNode;
    /** Positive conditioning. */
    positive: ConditioningProviderNode | PositiveConditioningProviderNode;
    /** Negative conditioning. */
    negative: ConditioningProviderNode | NegativeConditioningProviderNode;
    /** Latent image input. */
    latent_image: LatentImageProviderNode;
  }) {
    const steps = options.steps ?? 20;

    const positiveIndex = "CONDITIONING" in options.positive
      ? (options.positive as ConditioningProviderNode).CONDITIONING
      : (options.positive as PositiveConditioningProviderNode).POSITIVE_CONDITIONING;

    const negativeIndex = "CONDITIONING" in options.negative
      ? (options.negative as ConditioningProviderNode).CONDITIONING
      : (options.negative as NegativeConditioningProviderNode).NEGATIVE_CONDITIONING;

    super("KSamplerAdvanced", "KSampler (Advanced)", {
      add_noise: options.add_noise ?? "enable",
      noise_seed: options.noise_seed ?? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1,
      steps,
      cfg: options.cfg ?? 7,
      sampler_name: options.sampler_name ?? "euler",
      scheduler: options.scheduler ?? "normal",
      start_at_step: options.start_at_step ?? 0,
      end_at_step: options.end_at_step ?? steps,
      return_with_leftover_noise: options.return_with_leftover_noise ?? "disable",
      model: [
        options.model.node_id,
        options.model.MODEL,
      ],
      positive: [
        options.positive.node_id,
        positiveIndex,
      ],
      negative: [
        options.negative.node_id,
        negativeIndex,
      ],
      latent_image: [
        options.latent_image.node_id,
        options.latent_image.LATENT_IMAGE,
      ],
    });
  }
}
