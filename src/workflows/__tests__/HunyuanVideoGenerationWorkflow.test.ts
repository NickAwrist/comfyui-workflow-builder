import { describe, it, expect, beforeEach } from "vitest";
import { BaseNode } from "../../nodes/BaseNode";
import { hunyuanVideoGenerationWorkflow } from "../HunyuanVideoGenerationWorkflow";

/**
 * Helper: find the first node entry matching a given class_type.
 * For class_types that appear more than once (e.g. CLIPTextEncode),
 * use findAllNodesByClassType instead.
 */
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

/**
 * Helper: find all node entries matching a given class_type.
 */
function findAllNodesByClassType(
  json: Record<string, any>,
  classType: string
): { id: string; node: any }[] {
  return Object.entries(json)
    .filter(([, node]) => node.class_type === classType)
    .map(([id, node]) => ({ id, node }));
}

/**
 * Helper: resolve a connection input (e.g. ["3", 0]) to the class_type
 * of the referenced node.
 */
function resolveConnection(
  json: Record<string, any>,
  connection: [string, number]
): { classType: string; outputIndex: number } {
  const [refId, outputIndex] = connection;
  const refNode = json[refId];
  return { classType: refNode.class_type, outputIndex };
}

describe("HunyuanVideo Generation Workflow", () => {
  beforeEach(() => {
    BaseNode.resetNodeId();
  });

  const workflowInput = {
    positivePromptText: "pretty woman",
    negativePromptText: "",
    image: "sh_b73811a2_1770502979440_00001_.png [output]",
    unet_name: "hunyuanvideo1.5_720p_i2v_fp16.safetensors",
    vae_name: "hunyuanvideo15_vae_fp16.safetensors",
    clip_name1: "qwen_2.5_vl_7b_fp8_scaled.safetensors",
    clip_name2: "byt5_small_glyphxl_fp16.safetensors",
    clip_vision_name: "sigclip_vision_patch14_384.safetensors",
    width: 768,
    height: 1024,
    length: 73,
    batch_size: 1,
    seed: 894656733067856,
    steps: 20,
    cfg: 6,
    shift: 7,
    sampler_name: "euler",
    scheduler: "simple",
    denoise: 1,
    fps: 24,
    filename_prefix: "video/hunyuan_video_1.5",
    video_format: "auto",
    video_codec: "h264",
  };

  it("should contain exactly 17 nodes", () => {
    const json = hunyuanVideoGenerationWorkflow(workflowInput).workflow();
    expect(Object.keys(json)).toHaveLength(18);
  });

  it("should contain all expected class_types", () => {
    const json = hunyuanVideoGenerationWorkflow(workflowInput).workflow();
    const classTypes = Object.values(json).map((n: any) => n.class_type);

    const expectedTypes = [
      "LoadImage",
      "VAELoader",
      "DualCLIPLoader",
      "CLIPVisionLoader",
      "CLIPVisionEncode",
      "CLIPTextEncode", // positive
      "CLIPTextEncode", // negative
      "HunyuanVideo15ImageToVideo",
      "UNETLoader",
      "ModelSamplingSD3",
      "BasicScheduler",
      "RandomNoise",
      "KSamplerSelect",
      "CFGGuider",
      "SamplerCustomAdvanced",
      "VAEDecode",
      "CreateVideo",
      "SaveVideo",
    ];

    // Sort both arrays for comparison (handles duplicates correctly)
    expect(classTypes.sort()).toEqual(expectedTypes.sort());
  });

  it("should have correct scalar inputs for each node", () => {
    const json = hunyuanVideoGenerationWorkflow(workflowInput).workflow();

    // LoadImage
    const loadImage = findNodeByClassType(json, "LoadImage")!;
    expect(loadImage.node.inputs.image).toBe(
      "sh_b73811a2_1770502979440_00001_.png [output]"
    );

    // VAELoader
    const vaeLoader = findNodeByClassType(json, "VAELoader")!;
    expect(vaeLoader.node.inputs.vae_name).toBe(
      "hunyuanvideo15_vae_fp16.safetensors"
    );

    // DualCLIPLoader
    const dualClip = findNodeByClassType(json, "DualCLIPLoader")!;
    expect(dualClip.node.inputs.clip_name1).toBe(
      "qwen_2.5_vl_7b_fp8_scaled.safetensors"
    );
    expect(dualClip.node.inputs.clip_name2).toBe(
      "byt5_small_glyphxl_fp16.safetensors"
    );
    expect(dualClip.node.inputs.type).toBe("hunyuan_video_15");

    // CLIPVisionLoader
    const clipVisionLoader = findNodeByClassType(json, "CLIPVisionLoader")!;
    expect(clipVisionLoader.node.inputs.clip_name).toBe(
      "sigclip_vision_patch14_384.safetensors"
    );

    // CLIPTextEncode (positive + negative)
    const clipTextNodes = findAllNodesByClassType(json, "CLIPTextEncode");
    expect(clipTextNodes).toHaveLength(2);
    const texts = clipTextNodes.map((n) => n.node.inputs.text).sort();
    expect(texts).toEqual(["", "pretty woman"]);

    // HunyuanVideo15ImageToVideo
    const hunyuanI2V = findNodeByClassType(
      json,
      "HunyuanVideo15ImageToVideo"
    )!;
    expect(hunyuanI2V.node.inputs.width).toBe(768);
    expect(hunyuanI2V.node.inputs.height).toBe(1024);
    expect(hunyuanI2V.node.inputs.length).toBe(73);
    expect(hunyuanI2V.node.inputs.batch_size).toBe(1);

    // UNETLoader
    const unetLoader = findNodeByClassType(json, "UNETLoader")!;
    expect(unetLoader.node.inputs.unet_name).toBe(
      "hunyuanvideo1.5_720p_i2v_fp16.safetensors"
    );

    // ModelSamplingSD3
    const modelSampling = findNodeByClassType(json, "ModelSamplingSD3")!;
    expect(modelSampling.node.inputs.shift).toBe(7);

    // BasicScheduler
    const scheduler = findNodeByClassType(json, "BasicScheduler")!;
    expect(scheduler.node.inputs.scheduler).toBe("simple");
    expect(scheduler.node.inputs.steps).toBe(20);
    expect(scheduler.node.inputs.denoise).toBe(1);

    // RandomNoise
    const noise = findNodeByClassType(json, "RandomNoise")!;
    expect(noise.node.inputs.noise_seed).toBe(894656733067856);

    // KSamplerSelect
    const samplerSelect = findNodeByClassType(json, "KSamplerSelect")!;
    expect(samplerSelect.node.inputs.sampler_name).toBe("euler");

    // CFGGuider
    const cfgGuider = findNodeByClassType(json, "CFGGuider")!;
    expect(cfgGuider.node.inputs.cfg).toBe(6);

    // CreateVideo
    const createVideo = findNodeByClassType(json, "CreateVideo")!;
    expect(createVideo.node.inputs.fps).toBe(24);

    // SaveVideo
    const saveVideo = findNodeByClassType(json, "SaveVideo")!;
    expect(saveVideo.node.inputs.filename_prefix).toBe(
      "video/hunyuan_video_1.5"
    );
    expect(saveVideo.node.inputs.format).toBe("auto");
    expect(saveVideo.node.inputs.codec).toBe("h264");
  });

  it("should have correct connection topology", () => {
    const json = hunyuanVideoGenerationWorkflow(workflowInput).workflow();

    // CLIPVisionEncode -> CLIPVisionLoader (clip_vision, output 0) + LoadImage (image, output 0)
    const clipVisionEncode = findNodeByClassType(json, "CLIPVisionEncode")!;
    expect(
      resolveConnection(json, clipVisionEncode.node.inputs.clip_vision)
    ).toEqual({ classType: "CLIPVisionLoader", outputIndex: 0 });
    expect(
      resolveConnection(json, clipVisionEncode.node.inputs.image)
    ).toEqual({ classType: "LoadImage", outputIndex: 0 });

    // Both CLIPTextEncode nodes -> DualCLIPLoader (clip, output 0)
    const clipTextNodes = findAllNodesByClassType(json, "CLIPTextEncode");
    for (const clipText of clipTextNodes) {
      expect(resolveConnection(json, clipText.node.inputs.clip)).toEqual({
        classType: "DualCLIPLoader",
        outputIndex: 0,
      });
    }

    // HunyuanVideo15ImageToVideo connections
    const hunyuanI2V = findNodeByClassType(
      json,
      "HunyuanVideo15ImageToVideo"
    )!;
    const positivePrompt = clipTextNodes.find(
      (n) => n.node.inputs.text === "pretty woman"
    )!;
    const negativePrompt = clipTextNodes.find(
      (n) => n.node.inputs.text === ""
    )!;
    expect(
      resolveConnection(json, hunyuanI2V.node.inputs.positive)
    ).toEqual({ classType: "CLIPTextEncode", outputIndex: 0 });
    expect(hunyuanI2V.node.inputs.positive[0]).toBe(positivePrompt.id);
    expect(
      resolveConnection(json, hunyuanI2V.node.inputs.negative)
    ).toEqual({ classType: "CLIPTextEncode", outputIndex: 0 });
    expect(hunyuanI2V.node.inputs.negative[0]).toBe(negativePrompt.id);
    expect(resolveConnection(json, hunyuanI2V.node.inputs.vae)).toEqual({
      classType: "VAELoader",
      outputIndex: 0,
    });
    expect(
      resolveConnection(json, hunyuanI2V.node.inputs.start_image)
    ).toEqual({ classType: "LoadImage", outputIndex: 0 });
    expect(
      resolveConnection(json, hunyuanI2V.node.inputs.clip_vision_output)
    ).toEqual({ classType: "CLIPVisionEncode", outputIndex: 0 });

    // ModelSamplingSD3 -> UNETLoader (model, output 0)
    const modelSampling = findNodeByClassType(json, "ModelSamplingSD3")!;
    expect(
      resolveConnection(json, modelSampling.node.inputs.model)
    ).toEqual({ classType: "UNETLoader", outputIndex: 0 });

    // BasicScheduler -> UNETLoader (model, output 0)
    const scheduler = findNodeByClassType(json, "BasicScheduler")!;
    expect(resolveConnection(json, scheduler.node.inputs.model)).toEqual({
      classType: "UNETLoader",
      outputIndex: 0,
    });

    // CFGGuider -> ModelSamplingSD3 (model, output 0),
    //              HunyuanVideo15ImageToVideo (positive, output 0),
    //              HunyuanVideo15ImageToVideo (negative, output 1)
    const cfgGuider = findNodeByClassType(json, "CFGGuider")!;
    expect(resolveConnection(json, cfgGuider.node.inputs.model)).toEqual({
      classType: "ModelSamplingSD3",
      outputIndex: 0,
    });
    expect(
      resolveConnection(json, cfgGuider.node.inputs.positive)
    ).toEqual({
      classType: "HunyuanVideo15ImageToVideo",
      outputIndex: 0,
    });
    expect(
      resolveConnection(json, cfgGuider.node.inputs.negative)
    ).toEqual({
      classType: "HunyuanVideo15ImageToVideo",
      outputIndex: 1,
    });

    // SamplerCustomAdvanced connections
    const samplerAdvanced = findNodeByClassType(
      json,
      "SamplerCustomAdvanced"
    )!;
    expect(
      resolveConnection(json, samplerAdvanced.node.inputs.noise)
    ).toEqual({ classType: "RandomNoise", outputIndex: 0 });
    expect(
      resolveConnection(json, samplerAdvanced.node.inputs.guider)
    ).toEqual({ classType: "CFGGuider", outputIndex: 0 });
    expect(
      resolveConnection(json, samplerAdvanced.node.inputs.sampler)
    ).toEqual({ classType: "KSamplerSelect", outputIndex: 0 });
    expect(
      resolveConnection(json, samplerAdvanced.node.inputs.sigmas)
    ).toEqual({ classType: "BasicScheduler", outputIndex: 0 });
    expect(
      resolveConnection(json, samplerAdvanced.node.inputs.latent_image)
    ).toEqual({ classType: "HunyuanVideo15ImageToVideo", outputIndex: 2 });

    // VAEDecode -> SamplerCustomAdvanced (samples, output 0) + VAELoader (vae, output 0)
    const vaeDecode = findNodeByClassType(json, "VAEDecode")!;
    expect(
      resolveConnection(json, vaeDecode.node.inputs.samples)
    ).toEqual({ classType: "SamplerCustomAdvanced", outputIndex: 0 });
    expect(resolveConnection(json, vaeDecode.node.inputs.vae)).toEqual({
      classType: "VAELoader",
      outputIndex: 0,
    });

    // CreateVideo -> VAEDecode (images, output 0)
    const createVideo = findNodeByClassType(json, "CreateVideo")!;
    expect(
      resolveConnection(json, createVideo.node.inputs.images)
    ).toEqual({ classType: "VAEDecode", outputIndex: 0 });

    // SaveVideo -> CreateVideo (video, output 0)
    const saveVideo = findNodeByClassType(json, "SaveVideo")!;
    expect(resolveConnection(json, saveVideo.node.inputs.video)).toEqual({
      classType: "CreateVideo",
      outputIndex: 0,
    });
  });
});
