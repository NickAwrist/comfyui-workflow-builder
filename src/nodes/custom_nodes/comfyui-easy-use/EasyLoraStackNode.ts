// Custom node from https://github.com/yolain/ComfyUI-Easy-Use

import { BaseNode } from "../../BaseNode";
import type { LoraStackProviderNode } from "./outputs";

export interface LoraConfig {
  name: string;
  strength: number;
  modelStrength?: number;
  clipStrength?: number;
}

export class EasyLoraStackNode extends BaseNode implements LoraStackProviderNode {

  public readonly LORA_STACK_OUTPUT = 0;

  public get LORA_STACK(): number {
    return this.LORA_STACK_OUTPUT;
  }

  constructor(options: {
    toggle: boolean,
    mode?: 'simple' | 'advanced',
    loras: LoraConfig[]
  }) {
    const flatInputs: Record<string, any> = {
      toggle: options.toggle,
      mode: options.mode ?? 'simple',
      num_loras: options.loras.length,
    }

    const MAX_CAPACITY = 10;
    for (let i = 1; i <= MAX_CAPACITY; i++) {
      const config = options.loras[i - 1];

      if (config) {
        flatInputs[`lora_${i}_name`] = config.name;
        flatInputs[`lora_${i}_strength`] = config.strength;
        flatInputs[`lora_${i}_model_strength`] = config.modelStrength ?? 1.0;
        flatInputs[`lora_${i}_clip_strength`] = config.clipStrength ?? 1.0;
      } else {
        flatInputs[`lora_${i}_name`] = "None";
        flatInputs[`lora_${i}_strength`] = 1.0;
        flatInputs[`lora_${i}_model_strength`] = 1.0;
        flatInputs[`lora_${i}_clip_strength`] = 1.0;
      }
    }

    super("easy loraStack", "Easy Lora Stack", flatInputs);
  }
}