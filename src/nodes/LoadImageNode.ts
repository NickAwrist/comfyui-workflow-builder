import type { OutputsImage } from "./outputs/Providers";
import { BaseNode } from "./BaseNode";

export class LoadImageNode extends BaseNode implements OutputsImage {
  public readonly IMAGE_OUTPUT = 0;

  public get IMAGE(): number {
    return this.IMAGE_OUTPUT;
  }

  constructor(options: {
    image: string
  }) {
    super("LoadImage", "LoadImage", {
      image: options.image
    });
  }

}