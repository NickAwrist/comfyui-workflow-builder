import type { LoraConfig } from "../nodes/custom_nodes/EasyLoraStackNode";

export interface ImageGenerationWorkflowInput {
  positivePromptText: string;
  negativePromptText: string;
  checkpointName: string;
  loras?: LoraConfig[];
  seed?: number;
  cfg?: number;
  steps?: number;
  sampler?: string;
  width?: number;
  height?: number;
  image?: string;
  denoise?: number;
}