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

/**
 * Input for Wan2.2 Image-to-Video Generation Workflow
 *
 * @category Workflows
 */
export interface Wan22ImageToVideoWorkflowInput {
  /** The positive prompt text. */
  positivePromptText: string;
  /** The negative prompt text. Defaults to "". */
  negativePromptText?: string;
  /** The start image for image-to-video generation. */
  image: string;
  /** High-noise GGUF unet filename. */
  high_noise_unet_name: string;
  /** Low-noise GGUF unet filename. */
  low_noise_unet_name: string;
  /** High-noise LoRA filename. Defaults to "wan2.2_i2v_lightx2v_4steps_lora_v1_high_noise.safetensors". */
  high_noise_lora_name?: string;
  /** High-noise LoRA strength. Defaults to 1.0. */
  high_noise_lora_strength?: number;
  /** Low-noise LoRA filename. Defaults to "wan2.2_i2v_lightx2v_4steps_lora_v1_low_noise.safetensors". */
  low_noise_lora_name?: string;
  /** Low-noise LoRA strength. Defaults to 1.0. */
  low_noise_lora_strength?: number;
  /** CLIP model name. Defaults to "umt5_xxl_fp8_e4m3fn_scaled.safetensors". */
  clip_name?: string;
  /** CLIP type. Defaults to "wan". */
  clip_type?: string;
  /** CLIP device. Defaults to "default". */
  clip_device?: string;
  /** VAE model name. Defaults to "wan_2.1_vae.safetensors". */
  vae_name?: string;
  /** Output width. Defaults to 1024. */
  width?: number;
  /** Output height. Defaults to 1024. */
  height?: number;
  /** Number of video frames. Defaults to 65. */
  length?: number;
  /** Batch size. Defaults to 1. */
  batch_size?: number;
  /** ModelSamplingSD3 shift parameter. Defaults to 5. */
  shift?: number;
  /** Noise seed. Defaults to a random value. */
  seed?: number;
  /** Total sampling steps. Defaults to 4. */
  steps?: number;
  /** Stage 1 CFG scale. Defaults to 3. */
  cfg?: number;
  /** Stage 2 CFG scale. Defaults to 1. */
  stage2_cfg?: number;
  /** Sampler name. Defaults to "euler". */
  sampler_name?: string;
  /** Scheduler name. Defaults to "simple". */
  scheduler?: string;
  /** Stage 1 start step. Defaults to 0. */
  stage1_start_at_step?: number;
  /** Stage 1 end step. Defaults to 2. */
  stage1_end_at_step?: number;
  /** Stage 2 start step. Defaults to 2. */
  stage2_start_at_step?: number;
  /** Stage 2 end step. Defaults to 4. */
  stage2_end_at_step?: number;
  /** Video FPS. Defaults to 16. */
  fps?: number;
  /** Output filename prefix. Defaults to "video/Wan2.2_image_to_video". */
  filename_prefix?: string;
  /** Video format. Defaults to "auto". */
  video_format?: string;
  /** Video codec. Defaults to "auto". */
  video_codec?: string;
}