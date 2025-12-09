import { BaseNode } from "./BaseNode";
import type { VaeProviderNode } from "./outputs/Providers";

/**
 * Load VAE node
 * 
 * @remarks
 * This node loads a VAE.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const loadVaeNode = new LoadVaeNode({
 *   vae_name: "vae_name"
 * });
 * ```
 */
export class LoadVaeNode extends BaseNode implements VaeProviderNode {

  public readonly VAE_OUTPUT = 0;

  public get VAE(): number {
    return this.VAE_OUTPUT;
  }

  constructor(options: {
    /** The name of the vae to load. */
    vae_name: string
  }) {
    super("VAELoader", "Load VAE", {
      vae_name: options.vae_name
    });
  }
}