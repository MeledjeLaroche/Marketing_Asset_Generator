import { GoogleGenAI } from '@google/genai';

export const getAiClient = () => {
  // @ts-ignore
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  return new GoogleGenAI({ apiKey });
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9" | "1:4" | "1:8" | "4:1" | "8:1";
export type Resolution = "512px" | "1K" | "2K" | "4K";

export const generateBaseProduct = async (description: string) => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Generate a clean, high-quality photograph of the following product: ${description}. Place it isolated on a simple, minimalist studio background. VERY IMPORTANT: NO PEOPLE, NO HUMANS, NO HANDS, NO BODY PARTS. COMPLETELY EMPTY OF ANY HUMAN PRESENCE.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
  throw new Error("Failed to generate image.");
}

export const generateMarketingAsset = async (baseImageBase64: string, supportType: string, _resolution: Resolution, aspectRatio: AspectRatio) => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: baseImageBase64,
            mimeType: 'image/png'
          }
        },
        {
          text: `Transform and place this product seamlessly onto a ${supportType}. The product should look natural and well-lit in this new environment. Ensure the image dimensions fit the requested format. VERY IMPORTANT: NO PEOPLE, NO CROWD, NO HUMANS, NO HANDS. THE SCENE MUST BE 100% EMPTY OF ANY HUMAN PRESENCE.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio
      }
    }
  });

  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
  
  if (parts.some(p => p.text)) {
    throw new Error(parts.find(p => p.text)?.text || "Unknown error generating image");
  }

  throw new Error("Failed to generate marketing asset.");
}
