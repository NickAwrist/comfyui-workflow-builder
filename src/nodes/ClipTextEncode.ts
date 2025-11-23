import { BaseNode } from "./BaseNode";
import type { ClipProviderNode, OutputsConditioning } from "./outputs/Providers";

/**
 * Clip Text Encode node
 * 
 * @remarks
 * This node encodes text into conditioning for use in other nodes.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const positivePrompt = new ClipTextEncodeNode({
 *   text: "A photo of an astronaut riding a horse.",
 *   clipProvider: loadCheckpointNode
 * });
 * ```
 */
export class ClipTextEncodeNode extends BaseNode implements OutputsConditioning {
  public readonly CONDITIONING_OUTPUT = 0;

  public get CONDITIONING(): number {
    return this.CONDITIONING_OUTPUT;
  }

  constructor(options: {
    /** The text to encode. */
    text: string,
    /** The clip provider node. */
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