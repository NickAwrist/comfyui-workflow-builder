// Custom node from https://github.com/yolain/ComfyUI-Easy-Use

import { BaseNode } from "../../BaseNode";
import type { LoraStackProviderNode } from "./outputs";
import type { ModelProviderNode, ClipProviderNode, OutputsModel, OutputsClip } from "../../outputs/Providers";

/**
 * Easy Apply Lora Stack node
 * 
 * @remarks
 * This node applies a stack of LoRAs to a model and clip.
 * 
 * @category Custom Nodes
 * 
 * @example
 * ```typescript
 * const easyApplyLoraStackNode = new EasyApplyLoraStackNode({
 *   loraStack: loraStackNode,
 *   model: modelNode,
 *   optionalClip: clipNode
 * });
 * ```
 */
export class EasyApplyLoraStackNode extends BaseNode implements OutputsModel, OutputsClip {

  public readonly MODEL_OUTPUT = 0;
  public readonly CLIP_OUTPUT = 1;

  public get MODEL(): number {
    return this.MODEL_OUTPUT;
  }

  public get CLIP(): number {
    return this.CLIP_OUTPUT;
  }

  constructor(options: {
    /** The LoRA stack to apply. */
    loraStack: LoraStackProviderNode,
    /** The model to apply the LoRAs to. */
    model: ModelProviderNode,
    /** Optional clip to apply the LoRAs to. */
    optionalClip?: ClipProviderNode,
  }) {
    super("easy loraStackApply", "Easy Apply Lora Stack", {
      lora_stack: [
        options.loraStack.node_id,
        options.loraStack.LORA_STACK
      ],
      model: [
        options.model.node_id,
        options.model.MODEL
      ],
      ...(options.optionalClip ? {
        optional_clip: [
          options.optionalClip.node_id,
          options.optionalClip.CLIP
        ]
      } : {})
    });
  }
}