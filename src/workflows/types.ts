import type { LoraConfig } from "../nodes/custom_nodes/comfyui-easy-use/EasyLoraStackNode";

/**
 * Input for Image Generation Workflow
 * 
 * @category Workflows
 */
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
  batch_size?: number;
  image?: string;
  denoise?: number;
  vaeName?: string;
  clipName?: string;
  clipType?: string;
  clipDevice?: string;
  weightDtype?: string;
}