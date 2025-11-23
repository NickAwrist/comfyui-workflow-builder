import type { BaseNode } from "../../BaseNode";

// Custom node output from https://github.com/yolain/ComfyUI-Easy-Use
/** @category Custom Node Outputs */
export type LoraStackProviderNode = BaseNode & HasLoraStack;
/** @category Custom Node Outputs */
export interface HasLoraStack {
  get LORA_STACK(): number;
}