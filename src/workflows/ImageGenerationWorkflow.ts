import { LoadCheckpointNode } from "../nodes/LoadCheckpoint";
import { BaseWorkflow } from "./BaseWorkflow";
import { ClipTextEncodeNode } from "../nodes/ClipTextEncode";
import { EmptyLatentImageNode } from "../nodes/EmptyLatentImage";
import { KSamplerNode } from "../nodes/KSamplerNode";
import { VAEDecodeNode } from "../nodes/VAEDecodeNode";
import { SaveImageNode } from "../nodes/SaveImageNode";
import { EasyApplyLoraStackNode } from "../nodes/custom_nodes/EasyApplyLoraStackNode";
import { EasyLoraStackNode } from "../nodes/custom_nodes/EasyLoraStackNode";
import type { ImageGenerationWorkflowInput } from "./types";
import { LoadImageNode } from "../nodes/LoadImageNode";
import { VAEEncodeNode } from "../nodes/VAEEncodeNode";

export function basicImageGenerationWorkflow(input: ImageGenerationWorkflowInput): BaseWorkflow {
  const workflow = new BaseWorkflow();

  const loadCheckpointNode = new LoadCheckpointNode({
    checkpoint_name: input.checkpointName
  });

  workflow.addNode(loadCheckpointNode);
  let imageNode;
  if (input.image) {
    const loadImageNode = new LoadImageNode({
      image: input.image
    });
    workflow.addNode(loadImageNode);
    const vaEncodeNode = new VAEEncodeNode({
      pixels: loadImageNode,
      vae: loadCheckpointNode
    });
    imageNode = vaEncodeNode;
  } else {
    imageNode = new EmptyLatentImageNode();
  }
  workflow.addNode(imageNode);



  let easyLoraStackNode, easyApplyLoraStackNode;
  if (input.loras) {
    easyLoraStackNode = new EasyLoraStackNode({
      toggle: true,
      loras: input.loras
    });
    workflow.addNode(easyLoraStackNode);

    easyApplyLoraStackNode = new EasyApplyLoraStackNode({
      loraStack: easyLoraStackNode,
      model: loadCheckpointNode,
      optionalClip: loadCheckpointNode
    });
    workflow.addNode(easyApplyLoraStackNode);
  }

  const positivePrompt = new ClipTextEncodeNode({
    text: input.positivePromptText,
    clipProvider: easyApplyLoraStackNode ?? loadCheckpointNode
  });
  workflow.addNode(positivePrompt);

  const negativePrompt = new ClipTextEncodeNode({
    text: input.negativePromptText,
    clipProvider: easyApplyLoraStackNode ?? loadCheckpointNode
  });
  workflow.addNode(negativePrompt);

  const kSamplerNode = new KSamplerNode({
    seed: input.seed,
    steps: input.steps,
    cfg: input.cfg,
    samplerName: input.sampler,
    denoise: input.denoise,
    model: easyApplyLoraStackNode ?? loadCheckpointNode,
    positiveConditioning: positivePrompt,
    negativeConditioning: negativePrompt,
    latentImage: imageNode
  });
  workflow.addNode(kSamplerNode);

  const vaeDecodeNode = new VAEDecodeNode({
    samples: kSamplerNode,
    vae: loadCheckpointNode
  });
  workflow.addNode(vaeDecodeNode);

  const saveImageNode = new SaveImageNode({
    image: vaeDecodeNode
  });
  workflow.addNode(saveImageNode);

  console.log(workflow.workflow());

  return workflow;
}