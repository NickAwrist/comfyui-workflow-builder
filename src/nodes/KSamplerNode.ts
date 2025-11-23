import { BaseNode } from "./BaseNode";
import type { ConditioningProviderNode, OutputsLatentImage, LatentImageProviderNode, ModelProviderNode } from "./outputs/Providers";

/**
 * KSampler node
 * 
 * @remarks
 * This node samples from a model using the KSampler algorithm.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const kSamplerNode = new KSamplerNode({
 *   seed: 12345,
 *   steps: 20,
 *   cfg: 7,
 *   samplerName: 'euler',
 *   scheduler: 'normal',
 *   denoise: 1.0,
 *   model: modelNode,
 *   positiveConditioning: positiveConditioningNode,
 *   negativeConditioning: negativeConditioningNode,
 *   latentImage: latentImageNode
 * });
 * ```
 */
export class KSamplerNode extends BaseNode implements OutputsLatentImage {

  public readonly LATENT_IMAGE_OUTPUT = 0;

  public get LATENT_IMAGE(): number {
    return this.LATENT_IMAGE_OUTPUT;
  }

  constructor(options: {
    /** The seed for the random number generator. Defaults to a random number. */
    seed?: number,
    /** The number of steps to sample. Defaults to 20. */
    steps?: number,
    /** The configuration for the sampler. Defaults to 7. */
    cfg?: number,
    /** The name of the sampler. Defaults to 'euler'. */
    samplerName?: string,
    /** The scheduler for the sampler. Defaults to 'normal'. */
    scheduler?: string,
    /** The denoise value for the sampler. Defaults to 1.0. */
    denoise?: number,
    /** The model to sample from. */
    model: ModelProviderNode,
    /** The positive conditioning for the sampler. */
    positiveConditioning: ConditioningProviderNode,
    /** The negative conditioning for the sampler. */
    negativeConditioning: ConditioningProviderNode,
    /** The latent image to sample from. */
    latentImage: LatentImageProviderNode
  }) {
    super("KSampler", "KSampler", {
      seed: options.seed ?? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1,
      steps: options.steps ?? 20,
      cfg: options.cfg ?? 7,
      sampler_name: options.samplerName ?? 'euler',
      scheduler: options.scheduler ?? 'normal',
      denoise: options.denoise ?? 1.0,
      model: [
        options.model.node_id,
        options.model.MODEL
      ],
      positive: [
        options.positiveConditioning.node_id,
        options.positiveConditioning.CONDITIONING
      ],
      negative: [
        options.negativeConditioning.node_id,
        options.negativeConditioning.CONDITIONING
      ],
      latent_image: [
        options.latentImage.node_id,
        options.latentImage.LATENT_IMAGE
      ]
    });
  }
}