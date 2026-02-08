import { BaseNode } from "./BaseNode";
import type { OutputsClipVision } from "./outputs/Providers";

/**
 * CLIP Vision Loader node
 *
 * @remarks
 * This node loads a CLIP Vision model.
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const clipVisionLoader = new CLIPVisionLoaderNode({
 *   clip_name: "sigclip_vision_patch14_384.safetensors"
 * });
 * ```
 */
export class CLIPVisionLoaderNode extends BaseNode implements OutputsClipVision {
  public readonly CLIP_VISION_OUTPUT = 0;

  public get CLIP_VISION(): number {
    return this.CLIP_VISION_OUTPUT;
  }

  constructor(options: {
    /** The name of the CLIP Vision model to load. */
    clip_name: string;
  }) {
    super("CLIPVisionLoader", "Load CLIP Vision", {
      clip_name: options.clip_name,
    });
  }
}
