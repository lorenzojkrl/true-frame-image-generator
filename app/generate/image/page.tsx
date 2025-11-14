"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GenerationSidebar } from "@/components/GenerationSidebar";
import { GenerationCanvas } from "@/components/GenerationCanvas";
import { ImageThumbnailCarousel } from "@/components/ImageThumbnailCarousel";
import { PromptInput } from "@/components/PromptInput";
import { useSingleGeneration } from "@/hooks/use-single-generation";
import { ProviderKey, MODEL_CONFIGS } from "@/lib/provider-config";
import { getRandomSuggestions } from "@/lib/suggestions";

export default function GenerateImagePage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt");
  const initialProvider = (searchParams.get("provider") ||
    "openai") as ProviderKey;
  const initialModel =
    searchParams.get("model") || MODEL_CONFIGS.performance[initialProvider];

  const [selectedProvider, setSelectedProvider] =
    useState<ProviderKey>(initialProvider);
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [hasInitialGeneration, setHasInitialGeneration] = useState(false);

  const {
    currentImage,
    allImages,
    isLoading,
    error,
    generateImage,
    selectImage,
  } = useSingleGeneration();

  const suggestions = getRandomSuggestions();

  // Load reference image from localStorage on mount
  useEffect(() => {
    const storedImage = localStorage.getItem("referenceImage");
    if (storedImage) {
      setReferenceImage(storedImage);
      localStorage.removeItem("referenceImage");
    }
  }, []);

  // Auto-generate on mount if prompt exists
  useEffect(() => {
    if (initialPrompt && !hasInitialGeneration) {
      setHasInitialGeneration(true);
      generateImage(
        initialPrompt,
        selectedProvider,
        selectedModel,
        aspectRatio,
        referenceImage
      );
    }
  }, [
    initialPrompt,
    hasInitialGeneration,
    selectedProvider,
    selectedModel,
    aspectRatio,
    referenceImage,
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

  const handleSuggestionSelect = (prompt: string) => {
    generateImage(
      prompt,
      selectedProvider,
      selectedModel,
      aspectRatio,
      referenceImage
    );
  };

  const handleProviderChange = (provider: ProviderKey) => {
    setSelectedProvider(provider);
    // Update model to the first model of the new provider
    const providerConfig = MODEL_CONFIGS.performance;
    setSelectedModel(providerConfig[provider]);
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
          <div
            className="border-t border-zinc-800 bg-zinc-900"
            id="prompt-input"
          >
            <div className="max-w-4xl mx-auto px-6 py-4">
              <PromptInput
                onSubmit={handlePromptSubmit}
                isLoading={isLoading}
                showProviders={false}
                onToggleProviders={() => {}}
                mode="performance"
                onModeChange={() => {}}
                selectedModels={
                  { [selectedProvider]: selectedModel } as Record<
                    ProviderKey,
                    string
                  >
                }
                onModelChange={(_, model) => handleModelChange(model)}
                enabledProviders={
                  { [selectedProvider]: true } as Record<ProviderKey, boolean>
                }
                showModelSelector={false}
                editingImage={currentImage?.image || null}
                activeProvider={selectedProvider}
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
