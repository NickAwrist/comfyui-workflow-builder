import { BaseNode } from "./BaseNode";
import type { DecodedImageProviderNode } from "./outputs/Providers";

/**
 * Save Image node
 * 
 * @remarks
 * This node saves an image to a file.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const saveImageNode = new SaveImageNode({
 *   filenamePrefix: "ComfyUI",
 *   image: imageNode
 * });
 * ```
 */
export class SaveImageNode extends BaseNode {

  constructor(options: {
    /** The filename prefix for the saved image. Defaults to "ComfyUI". */
    filenamePrefix?: string,
    /** The image to save. */
    image: DecodedImageProviderNode,
  }) {
    super("SaveImage", "Save Image", {
      filename_prefix: options.filenamePrefix ?? "ComfyUI",
      images: [
        options.image.node_id,
        options.image.IMAGE
      ]
    });
  }

}