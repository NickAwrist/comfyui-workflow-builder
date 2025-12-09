import { BaseNode } from "./BaseNode";
import type { ClipProviderNode } from "./outputs/Providers";

/**
 * Load CLIP node
 * 
 * @remarks
 * This node loads a CLIP model.
 * 
 * @category Standard Nodes
 * 
 * @example
 * ```typescript
 * const loadClipNode = new LoadClipNode({
 *   clip_name: "clip_name",
 *   type: "lumina2",
 *   device: "default"
 * });
 * ```
 */
export class LoadClipNode extends BaseNode implements ClipProviderNode {

  public readonly CLIP_OUTPUT = 0;

  public get CLIP(): number {
    return this.CLIP_OUTPUT;
  }

  constructor(options: {
    /** The name of the clip to load. */
    clip_name: string
    /** The type of the clip to load. */
    type: string
    /** The device to load the clip on. */
    device?: string
  }) {
    super("CLIPLoader", "Load CLIP", {
      clip_name: options.clip_name,
      type: options.type,
      device: options.device ?? 'default'
    });
  }
}