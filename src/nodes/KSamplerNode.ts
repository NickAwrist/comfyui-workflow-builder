import { BaseNode } from "./BaseNode";
import type { ConditioningProviderNode, HasLatentImage, LatentImageProviderNode, ModelProviderNode } from "./outputs/Providers";

export class KSamplerNode extends BaseNode implements HasLatentImage {

  public readonly LATENT_IMAGE_OUTPUT = 0;

  public get LATENT_IMAGE(): number {
    return this.LATENT_IMAGE_OUTPUT;
  }

  constructor(options: {
    seed?: number,
    steps?: number,
    cfg?: number,
    samplerName?: string,
    scheduler?: string,
    denoise?: number,
    model: ModelProviderNode,
    positiveConditioning: ConditioningProviderNode,
    negativeConditioning: ConditioningProviderNode,
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