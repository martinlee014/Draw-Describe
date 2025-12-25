import { GoogleGenAI } from "@google/genai";

// --- Helper: Get Gemini Client ---
const getAiClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

// --- Fallback Generators ---

const generateFallbackImage = (item: string): string => {
  const prompt = encodeURIComponent(`${item}, highly detailed, 8k resolution, cinematic lighting, professional photography, aesthetic`);
  const seed = Math.floor(Math.random() * 10000);
  return `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;
};

const generateFallbackText = (item: string): string => {
  const templates = [
    `This is a visualization of "${item}".\n\n(Generated using Public AI Fallback)\n\n"${item}" typically features distinct visual characteristics captured in the artwork. In a fully connected version with an API Key, I would provide a detailed history and functional breakdown here.`,
    `I've sketched "${item}" for you using open-source AI models.\n\nThis visual interpretation highlights the key elements of the subject. Use this image as a creative reference or inspiration!`,
    `Presenting: "${item}".\n\nThe image was generated on-the-fly using public tools. It aims to capture the essence of the object in a high-quality style.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

// --- Main Exported Functions ---

export const generateImage = async (item: string): Promise<{ url: string; provider: string }> => {
  // 1. Try Gemini 2.5 Flash Image
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Illustration of ${item}, high quality, isolated on white background, highly detailed.` },
        ],
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return { 
          url: `data:image/png;base64,${part.inlineData.data}`,
          provider: 'Gemini 2.5 Flash'
        };
      }
    }
    throw new Error("No image data in Gemini response");

  } catch (error) {
    // 2. Fallback to Pollinations
    console.warn("Gemini Image Generation failed (using fallback):", error);
    // Simulate slight delay for fallback to feel natural
    await new Promise(r => setTimeout(r, 500));
    return { 
      url: generateFallbackImage(item),
      provider: 'Pollinations AI (Public)'
    };
  }
};

export const generateDescription = async (item: string): Promise<{ text: string; provider: string }> => {
  // 1. Try Gemini 3 Flash
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a concise, engaging, and educational description of "${item}". Explain what it is and an interesting fact about it. Keep it under 150 words.`,
    });

    if (response.text) {
      return { 
        text: response.text,
        provider: 'Gemini 3 Flash'
      };
    }
    throw new Error("No text in Gemini response");

  } catch (error) {
    // 2. Fallback to Template
    console.warn("Gemini Text Generation failed (using fallback):", error);
    await new Promise(r => setTimeout(r, 500));
    return { 
      text: generateFallbackText(item),
      provider: 'Template System'
    };
  }
};