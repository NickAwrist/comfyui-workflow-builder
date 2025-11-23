import axios, { AxiosError } from 'axios';
import type { AxiosResponse } from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import type { HistoryResponse, PromptWorkflow, QueuePromptResponse } from './types';
import { basicImageGeneration } from './templates/basicImageGeneration';

export class ComfyUIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async queuePrompt(prompt: PromptWorkflow): Promise<QueuePromptResponse> {
    const url = `${this.baseUrl}/prompt`;
    try {
      const response: AxiosResponse<QueuePromptResponse> = await axios.post(url, { prompt });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<unknown>;
        const status = err.response?.status;
        const data = err.response?.data;
        throw new Error(`ComfyUI queue error: ${status ?? 'unknown'} ${typeof data === 'string' ? data : JSON.stringify(data)}`);
      }
      throw error as Error;
    }
  }

  async downloadImage(filename: string, subfolder: string | undefined, folder_type: string, dest: string): Promise<string> {
    const params = new URLSearchParams({
      filename,
      subfolder: subfolder || '',
      type: folder_type,
    });
    const url = `${this.baseUrl}/view?${params.toString()}`;
    try {
      const response: AxiosResponse<ArrayBuffer> = await axios.get(url, { responseType: 'arraybuffer' });
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, Buffer.from(response.data));
      return dest;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<unknown>;
        const status = err.response?.status;
        const data = err.response?.data;
        throw new Error(`ComfyUI download error: ${status ?? 'unknown'} ${typeof data === 'string' ? data : JSON.stringify(data)}`);
      }
      throw error as Error;
    }
  }

  static async generateImage(promptText: string, outputDir: string = "./output"): Promise<string[]> {
    const client = new ComfyUIClient("http://127.0.0.1:8188");

    // 1. Get workflow
    const workflow = basicImageGeneration(promptText).workflow();

    // 2. Queue prompt
    const response = await client.queuePrompt(workflow as PromptWorkflow);
    const promptId = response.prompt_id;
    console.log(`Queued prompt ID: ${promptId}`);

    // 3. Poll for completion
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        const historyUrl = `${client.baseUrl}/history/${promptId}`;
        const historyRes: AxiosResponse<HistoryResponse> = await axios.get(historyUrl);
        const history = historyRes.data;

        if (history && history[promptId]) {
          const outputs = history[promptId].outputs;
          const files: string[] = [];

          if (!outputs) continue;

          for (const nodeId in outputs) {
            const nodeOutput = outputs[nodeId];
            if (nodeOutput && nodeOutput.images) {
              for (const image of nodeOutput.images) {
                const filename = image.filename;
                const subfolder = image.subfolder;
                const type = image.type;
                const dest = path.join(outputDir, filename);
                console.log(`Downloading image: ${filename} to ${dest}`);
                await client.downloadImage(filename, subfolder, type, dest);
                files.push(dest);
              }
            }
          }
          return files;
        }
      } catch (e) {
        // Ignore errors during polling
      }
    }
  }
}
