
import { GoogleGenAI } from "@google/genai";
import type { VideoGenerationResult } from "../types";

export const generateVideo = async (
  prompt: string,
  imageBase64: string | null,
  updateLoadingMessage: (message: string) => void
): Promise<VideoGenerationResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  // Create a new instance for each call to ensure the latest key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const payload: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  };

  if (imageBase64) {
    payload.image = {
      imageBytes: imageBase64,
      mimeType: 'image/png', // Assuming PNG, but can be dynamic
    };
  }
  
  updateLoadingMessage('Sending request to AI model...');
  let operation = await ai.models.generateVideos(payload);

  updateLoadingMessage('AI is processing your request... this can take a few minutes.');
  while (!operation.done) {
    // Wait for 10 seconds before checking the status again
    await new Promise(resolve => setTimeout(resolve, 10000));
    try {
      operation = await ai.operations.getVideosOperation({ operation: operation });
    } catch (e) {
      console.error("Error polling for video generation status:", e);
      // Let's not rethrow here to allow the loop to continue or fail gracefully,
      // but if operation is null, it will fail below.
    }
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    console.error("Video generation finished, but no download link was found.", operation);
    throw new Error("Video generation failed to produce a valid output.");
  }

  updateLoadingMessage('Video generated! Fetching file...');

  return { videoUrl: downloadLink };
};
