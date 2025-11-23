import type { OutputsImage } from "./outputs/Providers";
import { BaseNode } from "./BaseNode";

/**
 * Load Image node
 * 
 * @remarks
 * This node loads an image from a file.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const loadImageNode = new LoadImageNode({
 *   image: "image.jpg"
 * });
 * ```
 */
export class LoadImageNode extends BaseNode implements OutputsImage {
  public readonly IMAGE_OUTPUT = 0;

  public get IMAGE(): number {
    return this.IMAGE_OUTPUT;
  }

  constructor(options: {
    /** The image to load. */
    image: string
  }) {
    super("LoadImage", "LoadImage", {
      image: options.image
    });
  }

}