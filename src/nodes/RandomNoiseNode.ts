import { BaseNode } from "./BaseNode";
import type { OutputsNoise } from "./outputs/Providers";

/**
 * Random Noise node
 *
 * @remarks
 * This node generates random noise for use in sampling.
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const randomNoise = new RandomNoiseNode({
 *   noise_seed: 12345
 * });
 * ```
 */
export class RandomNoiseNode extends BaseNode implements OutputsNoise {
  public readonly NOISE_OUTPUT = 0;

  public get NOISE(): number {
    return this.NOISE_OUTPUT;
  }

  constructor(options?: {
    /** The seed for random noise generation. Defaults to a random value. */
    noise_seed?: number;
  }) {
    super("RandomNoise", "RandomNoise", {
      noise_seed: options?.noise_seed ?? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1,
    });
  }
}
