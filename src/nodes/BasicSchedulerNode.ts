import { BaseNode } from "./BaseNode";
import type { ModelProviderNode, OutputsSigmas } from "./outputs/Providers";

/**
 * Basic Scheduler node
 *
 * @remarks
 * This node creates a sigma schedule for use in advanced sampling pipelines.
 *
 * @category Standard Nodes
 *
 * @example
 * ```typescript
 * const scheduler = new BasicSchedulerNode({
 *   steps: 20,
 *   model: modelNode
 * });
 * ```
 */
export class BasicSchedulerNode extends BaseNode implements OutputsSigmas {
  public readonly SIGMAS_OUTPUT = 0;

  public get SIGMAS(): number {
    return this.SIGMAS_OUTPUT;
  }

  constructor(options: {
    /** The scheduler algorithm. Defaults to "simple". */
    scheduler?: string;
    /** The number of steps. Defaults to 20. */
    steps?: number;
    /** The denoise strength. Defaults to 1. */
    denoise?: number;
    /** The model to derive the schedule from. */
    model: ModelProviderNode;
  }) {
    super("BasicScheduler", "BasicScheduler", {
      scheduler: options.scheduler ?? "simple",
      steps: options.steps ?? 20,
      denoise: options.denoise ?? 1,
      model: [
        options.model.node_id,
        options.model.MODEL,
      ],
    });
  }
}
