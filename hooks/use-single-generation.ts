"use client";

import { useState, useCallback } from "react";
import { ProviderKey } from "@/lib/provider-config";

export interface GeneratedImage {
  id: string;
  image: string;
  timestamp: number;
  provider: string;
  modelId: string;
}

interface GenerationState {
  currentImage: GeneratedImage | null;
  allImages: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
}

export function useSingleGeneration() {
  const [state, setState] = useState<GenerationState>({
    currentImage: null,
    allImages: [],
    isLoading: false,
    error: null,
  });

  const generateImage = useCallback(
    async (
      prompt: string,
      provider: ProviderKey,
      model: string,
      aspectRatio?: string,
      referenceImage?: string | null
    ) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch("/api/generate-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            provider,
            modelId: model,
            aspectRatio,
            referenceImage,
          }),
        });

        if (!response.ok) {
          throw new Error(`Generation failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error || "Generation failed");
        }

        if (!data.image) {
          throw new Error("No image generated");
        }

        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          image: data.image,
          timestamp: Date.now(),
          provider,
          modelId: model,
        };

        setState((prev) => ({
          currentImage: newImage,
          allImages: [newImage, ...prev.allImages],
          isLoading: false,
          error: null,
        }));

        return newImage;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    []
  );

  const selectImage = useCallback((imageId: string) => {
    setState((prev) => {
      const selectedImage = prev.allImages.find((img) => img.id === imageId);
      return selectedImage ? { ...prev, currentImage: selectedImage } : prev;
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    currentImage: state.currentImage,
    allImages: state.allImages,
    isLoading: state.isLoading,
    error: state.error,
    generateImage,
    selectImage,
    clearError,
  };
}
