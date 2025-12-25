import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (aiClient) return aiClient;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please ensure process.env.API_KEY is set.");
  }

  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
};

/**
 * Generates an image based on the item name.
 * Uses gemini-2.5-flash-image which is generally available.
 */
export const generateImage = async (item: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Illustration of ${item}, high quality, isolated on white background.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    let textMessage = '';

    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
      if (part.text) {
        textMessage += part.text;
      }
    }
    
    // If we have text but no image, it's likely a refusal or a text-only response
    if (textMessage) {
      const cleanMessage = textMessage.replace(/\n/g, ' ').trim();
      throw new Error(`AI Response: ${cleanMessage}`);
    }
    
    throw new Error("The model did not return an image. It might have been filtered for safety.");
  } catch (error: any) {
    console.error("Image generation error:", error);
    
    if (error.message?.includes("403") || error.status === 403) {
      throw new Error("Permission denied. The API Key may not have access to image generation models.");
    }
    
    throw error;
  }
};

/**
 * Generates a description based on the item name.
 * Uses gemini-3-flash-preview for text generation.
 */
export const generateDescription = async (item: string): Promise<string> => {
  try {
    const ai = getAiClient();
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