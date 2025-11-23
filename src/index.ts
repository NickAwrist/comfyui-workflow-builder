import { ComfyUIClient } from "./ComfyUIClient";

async function main() {
  try {
    const files = await ComfyUIClient.generateImage("A cyberpunk city with neon lights, realistic, 8k");
    console.log("Generated images:", files);
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

main();