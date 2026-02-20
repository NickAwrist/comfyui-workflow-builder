import { describe, it, expect, beforeEach } from "vitest";
import { BaseNode } from "../../nodes/BaseNode";
import { wan22ImageToVideoWorkflow } from "../Wan22ImageToVideoWorkflow";

function findNodeByClassType(
  json: Record<string, any>,
  classType: string
): { id: string; node: any } | undefined {
  for (const [id, node] of Object.entries(json)) {
    if (node.class_type === classType) {
      return { id, node };
    }
  }
  return undefined;
}

function findAllNodesByClassType(
  json: Record<string, any>,
  classType: string
): { id: string; node: any }[] {
  return Object.entries(json)
    .filter(([, node]) => node.class_type === classType)
    .map(([id, node]) => ({ id, node }));
}

function resolveConnection(
  json: Record<string, any>,
  connection: [string, number]
): { classType: string; outputIndex: number } {
  const [refId, outputIndex] = connection;
  const refNode = json[refId];
  return { classType: refNode.class_type, outputIndex };
}

describe("Wan2.2 Image-to-Video Workflow", () => {
  beforeEach(() => {
    BaseNode.resetNodeId();
  });

  const workflowInput = {
    positivePromptText: "woman dancing",
    negativePromptText: "bad quality",
    image: "start_frame.png",
    high_noise_unet_name: "wan2.2_i2v_high_noise_14B_Q5_K_M.gguf",
    low_noise_unet_name: "wan2.2_i2v_low_noise_14B_Q5_K_M.gguf",
    high_noise_lora_name: "wan2.2_i2v_lightx2v_4steps_lora_v1_high_noise.safetensors",
    high_noise_lora_strength: 1.0,
    low_noise_lora_name: "wan2.2_i2v_lightx2v_4steps_lora_v1_low_noise.safetensors",
    low_noise_lora_strength: 1.0,
    clip_name: "umt5_xxl_fp8_e4m3fn_scaled.safetensors",
    clip_type: "wan",
    vae_name: "wan_2.1_vae.safetensors",
    width: 1024,
    height: 1024,
    length: 65,
    batch_size: 1,
    shift: 5,
    seed: 797577478140292,
    steps: 4,
    cfg: 3,
    stage2_cfg: 1,
    sampler_name: "euler",
    scheduler: "simple",
    stage1_start_at_step: 0,
    stage1_end_at_step: 2,
    stage2_start_at_step: 2,
    stage2_end_at_step: 4,
    fps: 16,
    filename_prefix: "video/Wan2.2_image_to_video",
    video_format: "auto",
    video_codec: "auto",
  };

  it("should produce flat numeric string node IDs only", () => {
    const json = wan22ImageToVideoWorkflow(workflowInput).workflow();
    for (const id of Object.keys(json)) {
      expect(id).toMatch(/^\d+$/);
    }
  });

  it("should contain exactly 17 nodes", () => {
    const json = wan22ImageToVideoWorkflow(workflowInput).workflow();
    expect(Object.keys(json)).toHaveLength(18);
  });

  it("should contain all expected class_types", () => {
    const json = wan22ImageToVideoWorkflow(workflowInput).workflow();
    const classTypes = Object.values(json).map((n: any) => n.class_type);

    const expectedTypes = [
      "LoadImage",
      "CLIPLoader",
      "VAELoader",
      "CLIPTextEncode",
      "CLIPTextEncode",
      "WanImageToVideo",
      "UnetLoaderGGUF",
      "LoraLoaderModelOnly",
      "ModelSamplingSD3",
      "KSamplerAdvanced",
      "UnetLoaderGGUF",
      "LoraLoaderModelOnly",
      "ModelSamplingSD3",
      "KSamplerAdvanced",
      "UnloadAllModels",
      "VAEDecode",
      "CreateVideo",
      "SaveVideo",
    ];

    expect(classTypes.sort()).toEqual(expectedTypes.sort());
  });

  it("should have correct scalar inputs", () => {
    const json = wan22ImageToVideoWorkflow(workflowInput).workflow();

    const loadImage = findNodeByClassType(json, "LoadImage")!;
    expect(loadImage.node.inputs.image).toBe("start_frame.png");

    const clipLoader = findNodeByClassType(json, "CLIPLoader")!;
    expect(clipLoader.node.inputs.clip_name).toBe("umt5_xxl_fp8_e4m3fn_scaled.safetensors");
    expect(clipLoader.node.inputs.type).toBe("wan");

    const vaeLoader = findNodeByClassType(json, "VAELoader")!;
    expect(vaeLoader.node.inputs.vae_name).toBe("wan_2.1_vae.safetensors");

    const clipTextNodes = findAllNodesByClassType(json, "CLIPTextEncode");
    expect(clipTextNodes).toHaveLength(2);
    const texts = clipTextNodes.map((n) => n.node.inputs.text).sort();
    expect(texts).toEqual(["bad quality", "woman dancing"]);

    const wanI2V = findNodeByClassType(json, "WanImageToVideo")!;
    expect(wanI2V.node.inputs.width).toBe(1024);
    expect(wanI2V.node.inputs.height).toBe(1024);
    expect(wanI2V.node.inputs.length).toBe(65);
    expect(wanI2V.node.inputs.batch_size).toBe(1);

    const ggufNodes = findAllNodesByClassType(json, "UnetLoaderGGUF");
    expect(ggufNodes).toHaveLength(2);
    const ggufNames = ggufNodes.map((n) => n.node.inputs.unet_name).sort();
    expect(ggufNames).toEqual([
      "wan2.2_i2v_high_noise_14B_Q5_K_M.gguf",
      "wan2.2_i2v_low_noise_14B_Q5_K_M.gguf",
    ]);

    const loraNodes = findAllNodesByClassType(json, "LoraLoaderModelOnly");
    expect(loraNodes).toHaveLength(2);

    const samplerNodes = findAllNodesByClassType(json, "KSamplerAdvanced");
    expect(samplerNodes).toHaveLength(2);
    const stage1 = samplerNodes.find((n) => n.node.inputs.add_noise === "enable")!;
    expect(stage1.node.inputs.start_at_step).toBe(0);
    expect(stage1.node.inputs.end_at_step).toBe(2);
    expect(stage1.node.inputs.cfg).toBe(3);
    expect(stage1.node.inputs.return_with_leftover_noise).toBe("enable");

    const stage2 = samplerNodes.find((n) => n.node.inputs.add_noise === "disable")!;
    expect(stage2.node.inputs.start_at_step).toBe(2);
    expect(stage2.node.inputs.end_at_step).toBe(4);
    expect(stage2.node.inputs.cfg).toBe(1);
    expect(stage2.node.inputs.noise_seed).toBe(0);
    expect(stage2.node.inputs.return_with_leftover_noise).toBe("disable");

    const modelSamplingNodes = findAllNodesByClassType(json, "ModelSamplingSD3");
    expect(modelSamplingNodes).toHaveLength(2);
    for (const n of modelSamplingNodes) {
      expect(n.node.inputs.shift).toBe(5);
    }

    const createVideo = findNodeByClassType(json, "CreateVideo")!;
    expect(createVideo.node.inputs.fps).toBe(16);

    const saveVideo = findNodeByClassType(json, "SaveVideo")!;
    expect(saveVideo.node.inputs.filename_prefix).toBe("video/Wan2.2_image_to_video");
    expect(saveVideo.node.inputs.format).toBe("auto");
    expect(saveVideo.node.inputs.codec).toBe("auto");
  });

  it("should have correct connection topology", () => {
    const json = wan22ImageToVideoWorkflow(workflowInput).workflow();

    // CLIPTextEncode nodes -> CLIPLoader
    const clipTextNodes = findAllNodesByClassType(json, "CLIPTextEncode");
    for (const clipText of clipTextNodes) {
      expect(resolveConnection(json, clipText.node.inputs.clip)).toEqual({
        classType: "CLIPLoader",
        outputIndex: 0,
      });
    }

    // WanImageToVideo connections
    const wanI2V = findNodeByClassType(json, "WanImageToVideo")!;
    expect(resolveConnection(json, wanI2V.node.inputs.positive)).toEqual({
      classType: "CLIPTextEncode", outputIndex: 0,
    });
    expect(resolveConnection(json, wanI2V.node.inputs.negative)).toEqual({
      classType: "CLIPTextEncode", outputIndex: 0,
    });
    expect(resolveConnection(json, wanI2V.node.inputs.vae)).toEqual({
      classType: "VAELoader", outputIndex: 0,
    });
    expect(resolveConnection(json, wanI2V.node.inputs.start_image)).toEqual({
      classType: "LoadImage", outputIndex: 0,
    });

    // High-noise path: UnetLoaderGGUF -> LoraLoaderModelOnly -> ModelSamplingSD3 -> KSamplerAdvanced(stage1)
    const samplerNodes = findAllNodesByClassType(json, "KSamplerAdvanced");
    const stage1 = samplerNodes.find((n) => n.node.inputs.add_noise === "enable")!;
    const stage1Model = resolveConnection(json, stage1.node.inputs.model);
    expect(stage1Model.classType).toBe("ModelSamplingSD3");

    const highNoiseMS = json[stage1.node.inputs.model[0]];
    expect(resolveConnection(json, highNoiseMS.inputs.model).classType).toBe("LoraLoaderModelOnly");
    const highNoiseLora = json[highNoiseMS.inputs.model[0]];
    expect(resolveConnection(json, highNoiseLora.inputs.model).classType).toBe("UnetLoaderGGUF");

    // Stage1 conditioning from WanImageToVideo
    expect(resolveConnection(json, stage1.node.inputs.positive)).toEqual({
      classType: "WanImageToVideo", outputIndex: 0,
    });
    expect(resolveConnection(json, stage1.node.inputs.negative)).toEqual({
      classType: "WanImageToVideo", outputIndex: 1,
    });
    expect(resolveConnection(json, stage1.node.inputs.latent_image)).toEqual({
      classType: "WanImageToVideo", outputIndex: 2,
    });

    // Low-noise path: UnetLoaderGGUF -> LoraLoaderModelOnly -> ModelSamplingSD3 -> KSamplerAdvanced(stage2)
    const stage2 = samplerNodes.find((n) => n.node.inputs.add_noise === "disable")!;
    const stage2Model = resolveConnection(json, stage2.node.inputs.model);
    expect(stage2Model.classType).toBe("ModelSamplingSD3");

    const lowNoiseMS = json[stage2.node.inputs.model[0]];
    expect(resolveConnection(json, lowNoiseMS.inputs.model).classType).toBe("LoraLoaderModelOnly");
    const lowNoiseLora = json[lowNoiseMS.inputs.model[0]];
    expect(resolveConnection(json, lowNoiseLora.inputs.model).classType).toBe("UnetLoaderGGUF");

    // Stage2 latent from stage1
    expect(resolveConnection(json, stage2.node.inputs.latent_image)).toEqual({
      classType: "KSamplerAdvanced", outputIndex: 0,
    });
    expect(stage2.node.inputs.latent_image[0]).toBe(stage1.id);

    // UnloadAllModels -> stage2 sampler
    const unload = findNodeByClassType(json, "UnloadAllModels")!;
    expect(resolveConnection(json, unload.node.inputs.value)).toEqual({
      classType: "KSamplerAdvanced", outputIndex: 0,
    });
    expect(unload.node.inputs.value[0]).toBe(stage2.id);

    // VAEDecode -> UnloadAllModels + VAELoader
    const vaeDecode = findNodeByClassType(json, "VAEDecode")!;
    expect(resolveConnection(json, vaeDecode.node.inputs.samples)).toEqual({
      classType: "UnloadAllModels", outputIndex: 0,
    });
    expect(resolveConnection(json, vaeDecode.node.inputs.vae)).toEqual({
      classType: "VAELoader", outputIndex: 0,
    });

    // CreateVideo -> VAEDecode
    const createVideo = findNodeByClassType(json, "CreateVideo")!;
    expect(resolveConnection(json, createVideo.node.inputs.images)).toEqual({
      classType: "VAEDecode", outputIndex: 0,
    });

    // SaveVideo -> CreateVideo
    const saveVideo = findNodeByClassType(json, "SaveVideo")!;
    expect(resolveConnection(json, saveVideo.node.inputs.video)).toEqual({
      classType: "CreateVideo", outputIndex: 0,
    });
  });
});
