# ComfyUI Workflow Builder

A TypeScript library for programmatically building ComfyUI workflow JSONs. This library provides a type-safe, builder-pattern interface to create complex ComfyUI workflows.

## Features

- **Type-Safe Node Creation**: Define nodes with typed inputs to prevent configuration errors.
- **Builder Pattern**: Easily chain and connect nodes to build complex workflows.
- **Pre-built Templates**: Includes helpers for common workflows like Basic Image Generation.

## Installation

```bash
npm install comfyui-workflow-builder
# or
bun add comfyui-workflow-builder
```

## Usage

### 1. Building a Workflow Manually

You can build a workflow by instantiating nodes and connecting them.

```typescript
import { 
  BaseWorkflow, 
  LoadCheckpointNode, 
  EmptyLatentImageNode, 
  ClipTextEncodeNode, 
  KSamplerNode, 
  VAEDecodeNode, 
  SaveImageNode 
} from 'comfyui-workflow-builder';

// 1. Create a new workflow container
const workflow = new BaseWorkflow();

// 2. Create Nodes
const checkpoint = new LoadCheckpointNode({ 
  checkpoint_name: "v1-5-pruned-emaonly.ckpt" 
});
workflow.addNode(checkpoint);

const emptyLatent = new EmptyLatentImageNode({ 
  width: 512, 
  height: 512, 
  batch_size: 1 
});
workflow.addNode(emptyLatent);

const positivePrompt = new ClipTextEncodeNode({
  text: "A beautiful landscape, 8k, high quality",
  clipProvider: checkpoint // Connects to the CLIP output of the checkpoint node
});
workflow.addNode(positivePrompt);

const negativePrompt = new ClipTextEncodeNode({
  text: "blur, low quality, watermark",
  clipProvider: checkpoint
});
workflow.addNode(negativePrompt);

const kSampler = new KSamplerNode({
  seed: 123456789,
  steps: 20,
  cfg: 8,
  samplerName: "euler",
  scheduler: "normal",
  denoise: 1,
  model: checkpoint,
  positiveConditioning: positivePrompt,
  negativeConditioning: negativePrompt,
  latentImage: emptyLatent
});
workflow.addNode(kSampler);

const vaeDecode = new VAEDecodeNode({
  samples: kSampler,
  vae: checkpoint
});
workflow.addNode(vaeDecode);

const saveImage = new SaveImageNode({
  image: vaeDecode
});
workflow.addNode(saveImage);

// 3. Export to JSON
const workflowJson = workflow.workflow();
```

### 2. Using Pre-built Workflows

For common tasks, you can use the provided workflow factories.

```typescript
import { basicImageGenerationWorkflow } from 'comfyui-workflow-builder/workflows/ImageGenerationWorkflow';

const workflow = basicImageGenerationWorkflow({
  positivePromptText: "A cute cat",
  negativePromptText: "ugly, blurry",
  checkpointName: "v1-5-pruned.safetensors",
  seed: 67,
  steps: 20
});

// Get the JSON to send to the API
const json = workflow.workflow();
```

## Project Structure

- `src/nodes/`: Contains definitions for ComfyUI nodes (e.g., `KSamplerNode`, `LoadCheckpointNode`).
- `src/workflows/`: Contains workflow builders and templates.

## Docs

You can generate docs using `bun run docs` and view them using `npx http-server docs`.

## Contributing

Contributions are welcome! This project is still early and only contains very basic nodes for image generation. Please feel free to submit a Pull Request to add more nodes and functionality. Custom nodes are also supported in the `src/nodes/custom_nodes` directory.

```bash
git clone https://github.com/nickawrist/comfyui-workflow-builder.git
```

Clone the repository and run `bun install` to install dependencies. You can then run `bun run build` to build the project.