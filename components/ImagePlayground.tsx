"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PromptInput } from "@/components/PromptInput";
import { PromptSuggestions } from "@/components/PromptSuggestions";
import {
  ProviderKey,
  initializeProviderRecord,
  DEFAULT_MODEL,
  ALL_MODELS,
} from "@/lib/provider-config";
import { Suggestion } from "@/lib/suggestions";

export function ImagePlayground({
  suggestions: initialSuggestions,
}: {
  suggestions: Suggestion[];
}) {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [enabledProviders, setEnabledProviders] = useState(
    initializeProviderRecord(true)
  );
  const [activeProvider, setActiveProvider] = useState<ProviderKey>("gemini");
  const [suggestions, setSuggestions] =
    useState<Suggestion[]>(initialSuggestions);

  // Populate suggestions on client if not provided
  useEffect(() => {
    if (initialSuggestions.length === 0) {
      import("@/lib/suggestions").then(({ getRandomSuggestions }) => {
        setSuggestions(getRandomSuggestions());
      });
    }
  }, [initialSuggestions]);

  const handleModelChange = (providerKey: ProviderKey, model: string) => {
    setSelectedModel(model);
    // Find which provider this model belongs to
    const modelConfig = ALL_MODELS.find((m) => m.id === model);
    if (modelConfig) {
      setActiveProvider(modelConfig.provider);
    }
  };

  const handlePromptSubmit = (newPrompt: string, contextImage?: string) => {
    // Find the provider for the selected model
    const modelConfig = ALL_MODELS.find((m) => m.id === selectedModel);
    const provider = modelConfig?.provider || "gemini";

    // Store context image if present
    if (contextImage) {
      localStorage.setItem("referenceImage", contextImage);
    }

    // Navigate to generation page with query params
    const params = new URLSearchParams({
      prompt: newPrompt,
      provider: provider,
      model: selectedModel,
    });

    router.push(`/generate/image?${params.toString()}`);
  };

  const handleSuggestionSelect = (prompt: string) => {
    handlePromptSubmit(prompt, undefined);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center w-full">
          <PromptInput
            onSubmit={handlePromptSubmit}
            isLoading={false}
            showProviders={false}
            onToggleProviders={() => {}}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
          <PromptSuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
          />
        </div>
      </div>
    </div>
  );
}
