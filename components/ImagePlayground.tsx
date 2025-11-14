"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PromptInput } from "@/components/PromptInput";
import { PromptSuggestions } from "@/components/PromptSuggestions";
import {
  MODEL_CONFIGS,
  PROVIDER_ORDER,
  ProviderKey,
  ModelMode,
  initializeProviderRecord,
} from "@/lib/provider-config";
import { Suggestion } from "@/lib/suggestions";

export function ImagePlayground({
  suggestions: initialSuggestions,
}: {
  suggestions: Suggestion[];
}) {
  const router = useRouter();
  const [selectedModels, setSelectedModels] = useState<
    Record<ProviderKey, string>
  >(MODEL_CONFIGS.performance);
  const [enabledProviders, setEnabledProviders] = useState(
    initializeProviderRecord(true)
  );
  const [mode, setMode] = useState<ModelMode>("performance");
  const [activeProvider, setActiveProvider] = useState<ProviderKey>("openai");
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
    setSelectedModels((prev) => ({ ...prev, [providerKey]: model }));
    setActiveProvider(providerKey); // Track which provider was selected
  };

  const handlePromptSubmit = (newPrompt: string, contextImage?: string) => {
    // Use the tracked active provider (from model selection)
    const model = selectedModels[activeProvider];

    // Store context image if present
    if (contextImage) {
      localStorage.setItem("referenceImage", contextImage);
    }

    // Navigate to generation page with query params
    const params = new URLSearchParams({
      prompt: newPrompt,
      provider: activeProvider,
      model: model,
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
            mode={mode}
            onModeChange={() => {}}
            selectedModels={selectedModels}
            onModelChange={handleModelChange}
            enabledProviders={enabledProviders}
            activeProvider={activeProvider}
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
