import { BaseWorkflow } from "./BaseWorkflow";
import type { HunyuanVideoWorkflowInput } from "./types";
import { LoadImageNode } from "../nodes/LoadImageNode";
import { LoadVaeNode } from "../nodes/LoadVaeNode";
import { DualCLIPLoaderNode } from "../nodes/DualCLIPLoaderNode";
import { CLIPVisionLoaderNode } from "../nodes/CLIPVisionLoaderNode";
import { CLIPVisionEncodeNode } from "../nodes/CLIPVisionEncodeNode";
import { ClipTextEncodeNode } from "../nodes/ClipTextEncode";
import { HunyuanVideo15ImageToVideoNode } from "../nodes/HunyuanVideo15ImageToVideoNode";
import { LoadDiffusionModelNode } from "../nodes/LoadDiffusionModelNode";
import { ModelSamplingSD3Node } from "../nodes/ModelSamplingSD3Node";
import { BasicSchedulerNode } from "../nodes/BasicSchedulerNode";
import { RandomNoiseNode } from "../nodes/RandomNoiseNode";
import { KSamplerSelectNode } from "../nodes/KSamplerSelectNode";
import { CFGGuiderNode } from "../nodes/CFGGuiderNode";
import { SamplerCustomAdvancedNode } from "../nodes/SamplerCustomAdvancedNode";
import { VAEDecodeNode } from "../nodes/VAEDecodeNode";
import { CreateVideoNode } from "../nodes/CreateVideoNode";
import { SaveVideoNode } from "../nodes/SaveVideoNode";

/**
 * HunyuanVideo 1.5 Image-to-Video Generation Workflow
 *
 * @remarks
 * Creates a workflow for generating video from a start image using
 * the HunyuanVideo 1.5 pipeline with advanced sampling.
 *
 * @category Workflows
 *
 * @param input - The input configuration for the workflow.
 * @returns The constructed workflow.
 */
export function hunyuanVideoGenerationWorkflow(input: HunyuanVideoWorkflowInput): BaseWorkflow {
  const workflow = new BaseWorkflow();

  // Load start image
  const loadImageNode = new LoadImageNode({
    image: input.image,
  });
  workflow.addNode(loadImageNode);

  // Load VAE
  const loadVaeNode = new LoadVaeNode({
    vae_name: input.vae_name ?? "hunyuanvideo15_vae_fp16.safetensors",
  });
  workflow.addNode(loadVaeNode);

  // Load Dual CLIP
  const dualClipLoaderNode = new DualCLIPLoaderNode({
    clip_name1: input.clip_name1 ?? "qwen_2.5_vl_7b_fp8_scaled.safetensors",
    clip_name2: input.clip_name2 ?? "byt5_small_glyphxl_fp16.safetensors",
    type: input.clip_type ?? "hunyuan_video_15",
  });
  workflow.addNode(dualClipLoaderNode);

  // Load CLIP Vision
  const clipVisionLoaderNode = new CLIPVisionLoaderNode({
    clip_name: input.clip_vision_name ?? "sigclip_vision_patch14_384.safetensors",
  });
  workflow.addNode(clipVisionLoaderNode);

  // Encode start image with CLIP Vision
  const clipVisionEncodeNode = new CLIPVisionEncodeNode({
    clip_vision: clipVisionLoaderNode,
    image: loadImageNode,
  });
  workflow.addNode(clipVisionEncodeNode);

  // Encode prompts
  const positivePrompt = new ClipTextEncodeNode({
    text: input.positivePromptText,
    clipProvider: dualClipLoaderNode,
  });
  workflow.addNode(positivePrompt);

  const negativePrompt = new ClipTextEncodeNode({
    text: input.negativePromptText ?? "",
    clipProvider: dualClipLoaderNode,
  });
  workflow.addNode(negativePrompt);

  // HunyuanVideo I2V conditioning + latent
  const hunyuanI2VNode = new HunyuanVideo15ImageToVideoNode({
    width: input.width,
    height: input.height,
    length: input.length,
    batch_size: input.batch_size,
    positive: positivePrompt,
    negative: negativePrompt,
    vae: loadVaeNode,
    start_image: loadImageNode,
    clip_vision_output: clipVisionEncodeNode,
  });
  workflow.addNode(hunyuanI2VNode);

  // Load diffusion model
  const loadDiffusionModelNode = new LoadDiffusionModelNode({
    unet_name: input.unet_name,
  });
  workflow.addNode(loadDiffusionModelNode);

  // Model sampling
  const modelSamplingSD3Node = new ModelSamplingSD3Node({
    shift: input.shift ?? 7,
    model: loadDiffusionModelNode,
  });
  workflow.addNode(modelSamplingSD3Node);

  // Scheduler
  const basicSchedulerNode = new BasicSchedulerNode({
    scheduler: input.scheduler,
    steps: input.steps,
    denoise: input.denoise,
    model: loadDiffusionModelNode,
  });
  workflow.addNode(basicSchedulerNode);

  // Noise
  const randomNoiseNode = new RandomNoiseNode({
    noise_seed: input.seed,
  });
  workflow.addNode(randomNoiseNode);

  // Sampler selection
  const kSamplerSelectNode = new KSamplerSelectNode({
    sampler_name: input.sampler_name,
  });
  workflow.addNode(kSamplerSelectNode);

  // CFG Guider
  const cfgGuiderNode = new CFGGuiderNode({
    cfg: input.cfg,
    model: modelSamplingSD3Node,
    positive: hunyuanI2VNode,
    negative: hunyuanI2VNode,
  });
  workflow.addNode(cfgGuiderNode);

  // Advanced sampling
  const samplerCustomAdvancedNode = new SamplerCustomAdvancedNode({
    noise: randomNoiseNode,
    guider: cfgGuiderNode,
    sampler: kSamplerSelectNode,
    sigmas: basicSchedulerNode,
    latent_image: hunyuanI2VNode,
  });
  workflow.addNode(samplerCustomAdvancedNode);

  // Decode latent to images
  const vaeDecodeNode = new VAEDecodeNode({
    samples: samplerCustomAdvancedNode,
    vae: loadVaeNode,
  });
  workflow.addNode(vaeDecodeNode);

  // Create video from images
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
