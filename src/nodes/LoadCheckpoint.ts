import { BaseNode } from "./BaseNode";
import type { HasClip, ModelProviderNode, VaeProviderNode } from "./outputs/Providers";

export class LoadCheckpointNode extends BaseNode implements HasClip, ModelProviderNode, VaeProviderNode {

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
    checkpoint_name: string
  }) {
    super("CheckpointLoaderSimple", "Load Checkpoint", {
      ckpt_name: options.checkpoint_name
    });
  }
}