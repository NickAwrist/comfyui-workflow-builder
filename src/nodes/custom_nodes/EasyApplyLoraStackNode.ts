// Custom node from https://github.com/yolain/ComfyUI-Easy-Use

import { BaseNode } from "../BaseNode";
import type { LoraStackProviderNode } from "./outputs/Providers";
import type { ModelProviderNode, ClipProviderNode, HasModel, HasClip } from "../outputs/Providers";

export class EasyApplyLoraStackNode extends BaseNode implements HasModel, HasClip {

  public readonly MODEL_OUTPUT = 0;
  public readonly CLIP_OUTPUT = 1;

  public get MODEL(): number {
    return this.MODEL_OUTPUT;
  }

  public get CLIP(): number {
    return this.CLIP_OUTPUT;
  }

  constructor(options: {
    loraStack: LoraStackProviderNode,
    model: ModelProviderNode,
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