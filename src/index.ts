import { ComfyUIClient } from "./ComfyUIClient";

async function main() {
  try {
    const files = await ComfyUIClient.generateImage("Blonde woman making a happy face, 8k");
    console.log("Generated images:", files);
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

main();