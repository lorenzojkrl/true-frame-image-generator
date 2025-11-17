"use client";

import { useState } from "react";
import { GenerationCanvas } from "@/components/GenerationCanvas";
import { ImageThumbnailCarousel } from "@/components/ImageThumbnailCarousel";
import { PromptInput } from "@/components/PromptInput";
import { useSingleGeneration } from "@/hooks/use-single-generation";
import { ProviderKey } from "@/lib/provider-config";
import { WorkflowSidebar } from "@/components/WorkflowSidebar";
import { WorkflowSettingsPanel } from "@/components/WorkflowSettingsPanel";
import { Workflow } from "@/app/generate/types";
import { MOCK_WORKFLOWS } from "@/lib/providers/mockWorkflows";

export default function GenerateWorkflowPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number>(
    MOCK_WORKFLOWS[0].id
  );

  const selectedWorkflow = workflows.find((w) => w.id === selectedWorkflowId);

  const {
    currentImage,
    allImages,
    isLoading,
    error,
    generateImage,
    selectImage,
  } = useSingleGeneration();

  if (!selectedWorkflow) {
    return <div>Workflow not found</div>;
  }

  const handlePromptSubmit = (prompt: string, contextImage?: string) => {
    // Use currentImage as the base for editing if it exists
    const imageToEdit = currentImage?.image || null;

    // Use the first reference image if available (avoid undefined)
    // To be refined as some models accept between 0 and N images
    const referenceImage =
      selectedWorkflow.referenceImages.length > 0
        ? selectedWorkflow.referenceImages[0]
        : null;

    let fullPrompt = prompt || selectedWorkflow.prompt;
    if (selectedWorkflow.context) {
      // This should be explained more explicitly to the model
      fullPrompt += ` Context: ${selectedWorkflow.context}`;
    }
    generateImage(
      fullPrompt,
      selectedWorkflow.providerId as ProviderKey,
      selectedWorkflow.modelId,
      selectedWorkflow.aspectRatio,
      referenceImage,
      imageToEdit
    );
  };

  const handleWorkflowSelect = (workflow: Workflow) => {
    setSelectedWorkflowId(workflow.id);
  };

  const updateWorkflowFields = (updates: Partial<Workflow>) => {
    setWorkflows((prevWorkflows) =>
      prevWorkflows.map((w) =>
        w.id === selectedWorkflowId ? { ...w, ...updates } : w
      )
    );
  };

  const updateWorkflowField = <K extends keyof Workflow>(
    field: K,
    value: Workflow[K]
  ) => {
    updateWorkflowFields({ [field]: value } as Partial<Workflow>);
  };

  return (
    <div className="h-screen flex flex-col ">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden ">
        <WorkflowSidebar
          workflows={workflows}
          selectedWorkflowId={selectedWorkflowId}
          onWorkflowSelect={handleWorkflowSelect}
        />

        <WorkflowSettingsPanel
          workflow={selectedWorkflow}
          onContextChange={(context) => updateWorkflowField("context", context)}
          onPromptChange={(prompt) => updateWorkflowField("prompt", prompt)}
          onAspectRatioChange={(aspectRatio) =>
            updateWorkflowField("aspectRatio", aspectRatio)
          }
          onReferenceImagesChange={(images) =>
            updateWorkflowField("referenceImages", images)
          }
          onModelChange={(modelId, providerId) =>
            updateWorkflowFields({ modelId, providerId })
          }
        />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col pb-8" id="canvas-area">
          <GenerationCanvas
            image={currentImage?.image || null}
            isLoading={isLoading}
            provider={
              currentImage?.provider ||
              (selectedWorkflow.providerId as ProviderKey)
            }
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
                prompt={selectedWorkflow.prompt}
                onPromptChange={(prompt) =>
                  updateWorkflowField("prompt", prompt)
                }
                isLoading={isLoading}
                showProviders={false}
                onToggleProviders={() => {}}
                selectedModel={selectedWorkflow.modelId}
                onModelChange={(providerKey, model) =>
                  updateWorkflowFields({
                    modelId: model,
                    providerId: providerKey,
                  })
                }
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
