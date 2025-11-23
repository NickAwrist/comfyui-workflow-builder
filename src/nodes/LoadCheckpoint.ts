import { BaseNode } from "./BaseNode";
import type { OutputsClip, ModelProviderNode, VaeProviderNode } from "./outputs/Providers";

/**
 * Load Checkpoint node
 * 
 * @remarks
 * This node loads a checkpoint from a file.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const loadCheckpointNode = new LoadCheckpointNode({
 *   checkpoint_name: "checkpoint_name"
 * });
 * ```
 */
export class LoadCheckpointNode extends BaseNode implements OutputsClip, ModelProviderNode, VaeProviderNode {

  public readonly MODEL_OUTPUT = 0;
  public readonly CLIP_OUTPUT = 1;
  public readonly VAE_OUTPUT = 2;

  public get MODEL(): number {
    return this.MODEL_OUTPUT;
  }

  public get CLIP(): number {
    return this.CLIP_OUTPUT;
  }

  public get VAE(): number {
    return this.VAE_OUTPUT;
  }

  constructor(options: {
    /** The name of the checkpoint to load. */
    checkpoint_name: string
  }) {
    super("CheckpointLoaderSimple", "Load Checkpoint", {
      ckpt_name: options.checkpoint_name
    });
  }
}