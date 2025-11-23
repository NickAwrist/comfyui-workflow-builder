import { BaseNode } from "./BaseNode";
import type { DecodedImageProviderNode } from "./outputs/Providers";

export class SaveImageNode extends BaseNode {

  constructor(options: {
    filenamePrefix?: string,
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