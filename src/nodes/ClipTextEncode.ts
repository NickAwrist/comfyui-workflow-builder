import { BaseNode } from "./BaseNode";
import type { ClipProviderNode, OutputsConditioning } from "./outputs/Providers";

export class ClipTextEncodeNode extends BaseNode implements OutputsConditioning {

  public readonly CONDITIONING_OUTPUT = 0;

  public get CONDITIONING(): number {
    return this.CONDITIONING_OUTPUT;
  }

  constructor(options: {
    text: string,
    clipProvider: ClipProviderNode
  }) {
    super("CLIPTextEncode", "Clip Text Encode", {
      text: options.text,
      clip: [
        options.clipProvider.node_id,
        options.clipProvider.CLIP
      ]
    });
  }
}