import { BaseNode } from "./BaseNode";
import type { ModelProviderNode } from "./outputs/Providers";

/**
 * LoRA Loader (Model Only) node
 *
 * @remarks
 * Loads a LoRA and applies it to a model without requiring a CLIP input.
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const loraLoader = new LoraLoaderModelOnlyNode({
 *   lora_name: "my_lora.safetensors",
 *   strength_model: 1.0,
 *   model: someModelNode,
 * });
 * ```
 */
export class LoraLoaderModelOnlyNode extends BaseNode implements ModelProviderNode {

  public readonly MODEL_OUTPUT = 0;

  public get MODEL(): number {
    return this.MODEL_OUTPUT;
  }

  constructor(options: {
    /** The LoRA filename to load. */
    lora_name: string;
    /** Strength of the LoRA on the model. Defaults to 1.0. */
    strength_model?: number;
    /** The model to apply the LoRA to. */
    model: ModelProviderNode;
  }) {
    super("LoraLoaderModelOnly", "LoraLoaderModelOnly", {
      lora_name: options.lora_name,
      strength_model: options.strength_model ?? 1.0,
      model: [
        options.model.node_id,
        options.model.MODEL,
      ],
    });
  }
}
