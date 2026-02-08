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

/**
 * Input for HunyuanVideo Generation Workflow
 * 
 * @category Workflows
 */
export interface HunyuanVideoWorkflowInput {
  /** The positive prompt text. */
  positivePromptText: string;
  /** The negative prompt text. Defaults to "". */
  negativePromptText?: string;
  /** The start image for image-to-video generation. */
  image: string;
  /** The diffusion model name. */
  unet_name: string;
  /** The VAE model name. Defaults to "hunyuanvideo15_vae_fp16.safetensors". */
  vae_name?: string;
  /** The first CLIP model name. Defaults to "qwen_2.5_vl_7b_fp8_scaled.safetensors". */
  clip_name1?: string;
  /** The second CLIP model name. Defaults to "byt5_small_glyphxl_fp16.safetensors". */
  clip_name2?: string;
  /** The CLIP type. Defaults to "hunyuan_video_15". */
  clip_type?: string;
  /** The CLIP Vision model name. Defaults to "sigclip_vision_patch14_384.safetensors". */
  clip_vision_name?: string;
  /** The output width. Defaults to 768. */
  width?: number;
  /** The output height. Defaults to 1024. */
  height?: number;
  /** The number of video frames. Defaults to 73. */
  length?: number;
  /** The batch size. Defaults to 1. */
  batch_size?: number;
  /** The noise seed. Defaults to a random value. */
  seed?: number;
  /** The number of sampling steps. Defaults to 20. */
  steps?: number;
  /** The CFG scale. Defaults to 6. */
  cfg?: number;
  /** The ModelSamplingSD3 shift parameter. Defaults to 7. */
  shift?: number;
  /** The sampler name. Defaults to "euler". */
  sampler_name?: string;
  /** The scheduler algorithm. Defaults to "simple". */
  scheduler?: string;
  /** The denoise strength. Defaults to 1. */
  denoise?: number;
  /** The video frames per second. Defaults to 24. */
  fps?: number;
  /** The output filename prefix. Defaults to "video/hunyuan_video_1.5". */
  filename_prefix?: string;
  /** The video output format. Defaults to "auto". */
  video_format?: string;
  /** The video codec. Defaults to "h264". */
  video_codec?: string;
}