export interface PromptWorkflow {
  [key: string]: {
    inputs: Record<string, any>;
    class_type: string;
    _meta?: any;
  };
}

export interface QueuePromptResponse {
  prompt_id: string;
  number: number;
  node_errors: Record<string, any>;
}

export interface HistoryResponse {
  [promptId: string]: {
    prompt: any;
    outputs: Record<string, {
      images: Array<{
        filename: string;
        subfolder: string;
        type: string;
      }>;
    }>;
    status: {
      status_str: string;
      completed: boolean;
      messages: any[];
    };
  };
}
