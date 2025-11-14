import { GoogleGenAI } from "@google/genai";

export interface GenerateImageParams {
  prompt: string;
  model: string;
  size?: string;
  referenceImage?: string;
}

export interface GenerateImageResult {
  image: string; // base64 encoded image
}

export async function generateImageDirect({
  prompt,
  model,
  size = "1024x1024",
  referenceImage,
}: GenerateImageParams): Promise<GenerateImageResult> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
  });

  // Map size to Gemini's imageSize format
  let imageSize = "1K"; // Default 1024x1024
  if (size === "2048x2048") {
    imageSize = "2K";
  } else if (size === "4096x4096") {
    imageSize = "4K";
  }

  const config = {
    responseModalities: ["IMAGE"],
    imageConfig: {
      imageSize,
    },
  };

  // Build the prompt parts
  const parts: any[] = [{ text: prompt }];

  // Add reference image if provided
  if (referenceImage) {
    // Extract base64 data and mime type from data URL
    const matches = referenceImage.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      parts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    } else {
      // If it's already just base64 data without the data URL prefix,
      // assume it's PNG and use it directly
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: referenceImage,
        },
      });
    }
  }

  const contents = [
    {
      role: "user",
      parts,
    },
  ];

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    // Collect all image chunks
    for await (const chunk of response) {
      if (
        !chunk.candidates ||
        !chunk.candidates[0].content ||
        !chunk.candidates[0].content.parts
      ) {
        continue;
      }

      const inlineData = chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (inlineData) {
        const mimeType = inlineData.mimeType || "image/png";
        const base64Data = inlineData.data || "";

        return {
          image: base64Data, // Return just base64, not the full data URL
        };
      }
    }

    throw new Error("No image data received from Gemini");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
    throw error;
  }
}
