import { BaseNode } from "./BaseNode";
import type { OutputsSampler } from "./outputs/Providers";

/**
 * KSampler Select node
 *
 * @remarks
 * This node selects a sampler by name for use in advanced sampling pipelines.
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const samplerSelect = new KSamplerSelectNode({
 *   sampler_name: "euler"
 * });
 * ```
 */
export class KSamplerSelectNode extends BaseNode implements OutputsSampler {
  public readonly SAMPLER_OUTPUT = 0;

  public get SAMPLER(): number {
    return this.SAMPLER_OUTPUT;
  }

  constructor(options?: {
    /** The name of the sampler to use. Defaults to "euler". */
    sampler_name?: string;
  }) {
    super("KSamplerSelect", "KSamplerSelect", {
      sampler_name: options?.sampler_name ?? "euler",
    });
  }
}
