import { BaseNode } from "./BaseNode";
import type { VideoProviderNode } from "./outputs/Providers";

/**
 * Save Video node
 *
 * @remarks
 * This node saves a video to a file.
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const saveVideo = new SaveVideoNode({
 *   video: createVideoNode
 * });
 * ```
 */
export class SaveVideoNode extends BaseNode {
  constructor(options: {
    /** The filename prefix. Defaults to "video/ComfyUI". */
    filename_prefix?: string;
    /** The output format. Defaults to "auto". */
    format?: string;
    /** The video codec. Defaults to "h264". */
    codec?: string;
    /** The video to save. */
    video: VideoProviderNode;
  }) {
    super("SaveVideo", "Save Video", {
      filename_prefix: options.filename_prefix ?? "video/ComfyUI",
      format: options.format ?? "auto",
      codec: options.codec ?? "h264",
      video: [
        options.video.node_id,
        options.video.VIDEO,
      ],
    });
  }
}
