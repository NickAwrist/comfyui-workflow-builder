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

export function basicImageGenerationWorkflow(input: ImageGenerationWorkflowInput): BaseWorkflow {
  const workflow = new BaseWorkflow();

  const emptyLatentImageNode = new EmptyLatentImageNode();
  workflow.addNode(emptyLatentImageNode);

  const loadCheckpointNode = new LoadCheckpointNode({
    checkpoint_name: input.checkpointName
  });
  workflow.addNode(loadCheckpointNode);

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
    model: easyApplyLoraStackNode ?? loadCheckpointNode,
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
    image: vaeDecodeNode
  });
  workflow.addNode(saveImageNode);

  console.log(workflow.workflow());

  return workflow;
}