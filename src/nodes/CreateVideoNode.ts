import { BaseNode } from "./BaseNode";
import type { DecodedImageProviderNode, OutputsVideo } from "./outputs/Providers";

/**
 * Create Video node
 *
 * @remarks
 * This node creates a video from a sequence of images.
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const createVideo = new CreateVideoNode({
 *   fps: 24,
 *   images: vaeDecodeNode
 * });
 * ```
 */
export class CreateVideoNode extends BaseNode implements OutputsVideo {
  public readonly VIDEO_OUTPUT = 0;

  public get VIDEO(): number {
    return this.VIDEO_OUTPUT;
  }

  constructor(options: {
    /** Frames per second. Defaults to 24. */
    fps?: number;
    /** The decoded images to create the video from. */
    images: DecodedImageProviderNode;
  }) {
    super("CreateVideo", "Create Video", {
      fps: options.fps ?? 24,
      images: [
        options.images.node_id,
        options.images.IMAGE,
      ],
    });
  }
}
