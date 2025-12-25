import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

// Initialize the client
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Generates an image based on the item name.
 * Uses gemini-2.5-flash-image for efficient image generation.
 */
export const generateImage = async (item: string): Promise<string> => {
  if (!ai) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A high-quality, detailed, artistic illustration of ${item}. The subject should be centered, clear, and visually appealing on a clean background.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data received from the model.");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

/**
 * Generates a description based on the item name.
 * Uses gemini-3-flash-preview for text generation.
 */
export const generateDescription = async (item: string): Promise<string> => {
  if (!ai) throw new Error("API Key not found");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a concise, engaging, and educational description of "${item}". Explain what it is, its primary function, and an interesting fact about it. Keep it under 150 words.`,
    });

    return response.text || "No description available.";
  } catch (error) {
    console.error("Text generation error:", error);
    throw error;
  }
};