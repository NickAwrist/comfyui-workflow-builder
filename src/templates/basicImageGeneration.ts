import { ClipTextEncodeNode } from "../nodes/ClipTextEncode";
import { EmptyLatentImageNode } from "../nodes/EmptyLatentImage";
import { KSamplerNode } from "../nodes/KSamplerNode";
import { LoadCheckpointNode } from "../nodes/LoadCheckpoint";
import { SaveImageNode } from "../nodes/SaveImageNode";
import { VAEDecodeNode } from "../nodes/VAEDecodeNode";
import { BaseWorkflow } from "../workflows/BaseWorkflow";

// Example of a basic image generation workflow
export function basicImageGeneration(positivePromptText: string = "A photo of an astronaut riding a horse."): BaseWorkflow {
  const workflow = new BaseWorkflow();

  const emptyLatentImageNode = new EmptyLatentImageNode();
  workflow.addNode(emptyLatentImageNode);

  const loadCheckpointNode = new LoadCheckpointNode({
    checkpoint_name: "sd_xl_base_1.0.safetensors"
  });
  workflow.addNode(loadCheckpointNode);

  const positivePrompt = new ClipTextEncodeNode({
    text: positivePromptText,
    clipProvider: loadCheckpointNode
  });
  workflow.addNode(positivePrompt);

  const negativePrompt = new ClipTextEncodeNode({
    text: "Bad quality",
    clipProvider: loadCheckpointNode
  });
  workflow.addNode(negativePrompt);

  const kSamplerNode = new KSamplerNode({
    seed: Math.random(),
    steps: 20,
    cfg: 7,
    samplerName: "euler",
    scheduler: "normal",
    denoise: 1.0,
    model: loadCheckpointNode,
    positiveConditioning: positivePrompt,
    negativeConditioning: negativePrompt,
    latentImage: emptyLatentImageNode
  });
  workflow.addNode(kSamplerNode);

  const vaeDecodeNode = new VAEDecodeNode({
    samples: kSamplerNode,
    vae: loadCheckpointNode
  });
  workflow.addNode(vaeDecodeNode);

  const saveImageNode = new SaveImageNode({
    filenamePrefix: "ComfyUI",
    image: vaeDecodeNode
  });
  workflow.addNode(saveImageNode);

  console.log(workflow.workflow());

  return workflow;
}

basicImageGeneration();