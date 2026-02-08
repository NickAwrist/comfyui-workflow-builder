import { BaseNode } from "./BaseNode";
import type { OutputsClip } from "./outputs/Providers";

/**
 * Dual CLIP Loader node
 *
 * @remarks
 * This node loads two CLIP models simultaneously (e.g. for HunyuanVideo).
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const dualClipLoader = new DualCLIPLoaderNode({
 *   clip_name1: "qwen_2.5_vl_7b_fp8_scaled.safetensors",
 *   clip_name2: "byt5_small_glyphxl_fp16.safetensors",
 *   type: "hunyuan_video_15"
 * });
 * ```
 */
export class DualCLIPLoaderNode extends BaseNode implements OutputsClip {
  public readonly CLIP_OUTPUT = 0;

  public get CLIP(): number {
    return this.CLIP_OUTPUT;
  }

  constructor(options: {
    /** The name of the first CLIP model to load. */
    clip_name1: string;
    /** The name of the second CLIP model to load. */
    clip_name2: string;
    /** The type of the CLIP models. */
    type: string;
    /** The device to load the models on. Defaults to "default". */
    device?: string;
  }) {
    super("DualCLIPLoader", "DualCLIPLoader", {
      clip_name1: options.clip_name1,
      clip_name2: options.clip_name2,
      type: options.type,
      device: options.device ?? "default",
    });
  }
}
