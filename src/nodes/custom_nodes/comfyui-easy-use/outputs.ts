import type { BaseNode } from "../../BaseNode";

// Custom node output from https://github.com/yolain/ComfyUI-Easy-Use
export type LoraStackProviderNode = BaseNode & HasLoraStack;
export interface HasLoraStack {
  get LORA_STACK(): number;
}