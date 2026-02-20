import { BaseWorkflow } from "./BaseWorkflow";
import type { Wan22ImageToVideoWorkflowInput } from "./types";
import { LoadImageNode } from "../nodes/LoadImageNode";
import { LoadClipNode } from "../nodes/LoadClipNode";
import { LoadVaeNode } from "../nodes/LoadVaeNode";
import { ClipTextEncodeNode } from "../nodes/ClipTextEncode";
import { WanImageToVideoNode } from "../nodes/WanImageToVideoNode";
import { UnetLoaderGGUFNode } from "../nodes/UnetLoaderGGUFNode";
import { LoraLoaderModelOnlyNode } from "../nodes/LoraLoaderModelOnlyNode";
import { ModelSamplingSD3Node } from "../nodes/ModelSamplingSD3Node";
import { KSamplerAdvancedNode } from "../nodes/KSamplerAdvancedNode";
import { UnloadAllModelsNode } from "../nodes/UnloadAllModelsNode";
import { VAEDecodeNode } from "../nodes/VAEDecodeNode";
import { CreateVideoNode } from "../nodes/CreateVideoNode";
import { SaveVideoNode } from "../nodes/SaveVideoNode";

/**
 * Wan2.2 Image-to-Video Generation Workflow
 *
 * @remarks
 * Creates a two-stage LightX2V-accelerated Wan2.2 image-to-video pipeline.
 * Stage 1 samples with a high-noise LoRA/model, stage 2 refines with a
 * low-noise LoRA/model. Models are unloaded before VAE decode to free VRAM.
 *
 * @category Workflows
 *
 * @param input - The input configuration for the workflow.
 * @returns The constructed workflow.
 */
export function wan22ImageToVideoWorkflow(input: Wan22ImageToVideoWorkflowInput): BaseWorkflow {
  const workflow = new BaseWorkflow();

  // Load start image
  const loadImageNode = new LoadImageNode({
    image: input.image,
  });
  workflow.addNode(loadImageNode);

  // Load CLIP
  const loadClipNode = new LoadClipNode({
    clip_name: input.clip_name ?? "umt5_xxl_fp8_e4m3fn_scaled.safetensors",
    type: input.clip_type ?? "wan",
    device: input.clip_device,
  });
  workflow.addNode(loadClipNode);

  // Load VAE
  const loadVaeNode = new LoadVaeNode({
    vae_name: input.vae_name ?? "wan_2.1_vae.safetensors",
  });
  workflow.addNode(loadVaeNode);

  // Positive prompt
  const positivePrompt = new ClipTextEncodeNode({
    text: input.positivePromptText,
    clipProvider: loadClipNode,
  });
  workflow.addNode(positivePrompt);

  // Negative prompt
  const negativePrompt = new ClipTextEncodeNode({
    text: input.negativePromptText ?? "",
    clipProvider: loadClipNode,
  });
  workflow.addNode(negativePrompt);

  // WanImageToVideo conditioning + latent
  const wanI2VNode = new WanImageToVideoNode({
    width: input.width,
    height: input.height,
    length: input.length,
    batch_size: input.batch_size,
    positive: positivePrompt,
    negative: negativePrompt,
    vae: loadVaeNode,
    start_image: loadImageNode,
  });
  workflow.addNode(wanI2VNode);

  // --- High-noise path (stage 1) ---
  const highNoiseUnet = new UnetLoaderGGUFNode({
    unet_name: input.high_noise_unet_name,
  });
  workflow.addNode(highNoiseUnet);

  const highNoiseLora = new LoraLoaderModelOnlyNode({
    lora_name: input.high_noise_lora_name ?? "wan2.2_i2v_lightx2v_4steps_lora_v1_high_noise.safetensors",
    strength_model: input.high_noise_lora_strength,
    model: highNoiseUnet,
  });
  workflow.addNode(highNoiseLora);

  const highNoiseModelSampling = new ModelSamplingSD3Node({
    shift: input.shift,
    model: highNoiseLora,
  });
  workflow.addNode(highNoiseModelSampling);

  const stage1Sampler = new KSamplerAdvancedNode({
    add_noise: "enable",
    noise_seed: input.seed,
    steps: input.steps,
    cfg: input.cfg,
    sampler_name: input.sampler_name,
    scheduler: input.scheduler,
    start_at_step: input.stage1_start_at_step ?? 0,
    end_at_step: input.stage1_end_at_step ?? 2,
    return_with_leftover_noise: "enable",
    model: highNoiseModelSampling,
    positive: wanI2VNode,
    negative: wanI2VNode,
    latent_image: wanI2VNode,
  });
  workflow.addNode(stage1Sampler);

  // --- Low-noise path (stage 2) ---
  const lowNoiseUnet = new UnetLoaderGGUFNode({
    unet_name: input.low_noise_unet_name,
  });
  workflow.addNode(lowNoiseUnet);

  const lowNoiseLora = new LoraLoaderModelOnlyNode({
    lora_name: input.low_noise_lora_name ?? "wan2.2_i2v_lightx2v_4steps_lora_v1_low_noise.safetensors",
    strength_model: input.low_noise_lora_strength,
    model: lowNoiseUnet,
  });
  workflow.addNode(lowNoiseLora);

  const lowNoiseModelSampling = new ModelSamplingSD3Node({
    shift: input.shift,
    model: lowNoiseLora,
  });
  workflow.addNode(lowNoiseModelSampling);

  const stage2Sampler = new KSamplerAdvancedNode({
    add_noise: "disable",
    noise_seed: 0,
    steps: input.steps,
    cfg: input.stage2_cfg ?? 1,
    sampler_name: input.sampler_name,
    scheduler: input.scheduler,
    start_at_step: input.stage2_start_at_step ?? 2,
    end_at_step: input.stage2_end_at_step ?? 4,
    return_with_leftover_noise: "disable",
    model: lowNoiseModelSampling,
    positive: wanI2VNode,
    negative: wanI2VNode,
    latent_image: stage1Sampler,
  });
  workflow.addNode(stage2Sampler);

  // Unload models before VAE decode
  const unloadNode = new UnloadAllModelsNode({
    value: stage2Sampler,
  });
  workflow.addNode(unloadNode);

  // VAE decode
  const vaeDecodeNode = new VAEDecodeNode({
    samples: unloadNode,
    vae: loadVaeNode,
  });
  workflow.addNode(vaeDecodeNode);

  // Create video
  const createVideoNode = new CreateVideoNode({
    fps: input.fps,
    images: vaeDecodeNode,
  });
  workflow.addNode(createVideoNode);

  // Save video
  const saveVideoNode = new SaveVideoNode({
    filename_prefix: input.filename_prefix,
    format: input.video_format,
    codec: input.video_codec,
    video: createVideoNode,
  });
  workflow.addNode(saveVideoNode);

  return workflow;
}
