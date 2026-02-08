import { BaseNode } from "./BaseNode";
import type { ClipVisionProviderNode, DecodedImageProviderNode, OutputsClipVisionEncoded } from "./outputs/Providers";

/**
 * CLIP Vision Encode node
 *
 * @remarks
 * This node encodes an image using a CLIP Vision model.
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const clipVisionEncode = new CLIPVisionEncodeNode({
 *   clip_vision: clipVisionLoaderNode,
 *   image: loadImageNode
 * });
 * ```
 */
export class CLIPVisionEncodeNode extends BaseNode implements OutputsClipVisionEncoded {
  public readonly CLIP_VISION_OUTPUT_INDEX = 0;

  public get CLIP_VISION_OUTPUT(): number {
    return this.CLIP_VISION_OUTPUT_INDEX;
  }

  constructor(options: {
    /** The crop mode. Defaults to "center". */
    crop?: string;
    /** The CLIP Vision model to use. */
    clip_vision: ClipVisionProviderNode;
    /** The image to encode. */
    image: DecodedImageProviderNode;
  }) {
    super("CLIPVisionEncode", "CLIP Vision Encode", {
      crop: options.crop ?? "center",
      clip_vision: [
        options.clip_vision.node_id,
        options.clip_vision.CLIP_VISION,
      ],
      image: [
        options.image.node_id,
        options.image.IMAGE,
      ],
    });
  }
}
