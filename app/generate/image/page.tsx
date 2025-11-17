"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { GenerationSidebar } from "@/components/GenerationSidebar";
import { GenerationCanvas } from "@/components/GenerationCanvas";
import { ImageThumbnailCarousel } from "@/components/ImageThumbnailCarousel";
import { PromptInput } from "@/components/PromptInput";
import { useSingleGeneration } from "@/hooks/use-single-generation";
import { ProviderKey, DEFAULT_MODEL } from "@/lib/provider-config";

export default function GenerateImagePage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt");
  const initialProvider = (searchParams.get("provider") ||
    "gemini") as ProviderKey;
  const initialModel = searchParams.get("model") || DEFAULT_MODEL;

  const [selectedProvider, setSelectedProvider] =
    useState<ProviderKey>(initialProvider);
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const hasInitialGenerationRef = useRef(false);

  const {
    currentImage,
    allImages,
    isLoading,
    error,
    generateImage,
    selectImage,
  } = useSingleGeneration();

  // Load reference image and auto-generate if prompt exists
  useEffect(() => {
    if (!hasInitialGenerationRef.current) {
      hasInitialGenerationRef.current = true;

      // First: Load reference image from localStorage
      const storedImage = localStorage.getItem("referenceImage");
      let imageToUse: string | null = null;

      if (storedImage) {
        setReferenceImage(storedImage);
        localStorage.removeItem("referenceImage");
        imageToUse = storedImage;
      }

      // Second: Generate image with the loaded reference image
      if (initialPrompt) {
        generateImage(
          initialPrompt,
          selectedProvider,
          selectedModel,
          aspectRatio,
          imageToUse
        );
      }
    }
  }, [
    initialPrompt,
    selectedProvider,
    selectedModel,
    aspectRatio,
    generateImage,
  ]);

  const handlePromptSubmit = (prompt: string) => {
    // Use currentImage as the base for editing if it exists
    const imageToEdit = currentImage?.image || null;

    generateImage(
      prompt,
      selectedProvider,
      selectedModel,
      aspectRatio,
      referenceImage,
      imageToEdit
    );
  };

  const handleProviderChange = (provider: ProviderKey) => {
    setSelectedProvider(provider);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  return (
    <div className="h-screen flex flex-col ">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden ">
        {/* Sidebar */}
        <GenerationSidebar
          selectedModel={selectedModel}
          selectedProvider={selectedProvider}
          onModelChange={handleModelChange}
          onProviderChange={handleProviderChange}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          referenceImage={referenceImage}
          onReferenceImageChange={setReferenceImage}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col pb-8" id="canvas-area">
          <GenerationCanvas
            image={currentImage?.image || null}
            isLoading={isLoading}
            provider={currentImage?.provider || selectedProvider}
          />

          {/* Thumbnail Carousel - Fixed above input */}
          <ImageThumbnailCarousel
            images={allImages}
            selectedImageId={currentImage?.id || null}
            onImageSelect={selectImage}
          />

          {/* Fixed Input at Bottom */}
          <div className="bg-zinc-950" id="prompt-input">
            <div className="max-w-4xl mx-auto px-6 py-4">
              <PromptInput
                onSubmit={handlePromptSubmit}
                isLoading={isLoading}
                showProviders={false}
                onToggleProviders={() => {}}
                selectedModel={selectedModel}
                onModelChange={(_, model) => handleModelChange(model)}
                showModelSelector={false}
                editingImage={currentImage?.image || null}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-24 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
