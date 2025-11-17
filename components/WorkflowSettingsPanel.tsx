"use client";

import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@radix-ui/react-select";
import { Textarea } from "./ui/textarea";
import { useState, useMemo } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio, Workflow } from "@/app/generate/types";
import { FieldLabel } from "@/components/ui/field-label";
import { PROVIDER_ORDER, PROVIDERS, ProviderKey } from "@/lib/provider-config";
import { imageHelpers } from "@/lib/image-helpers";

const ASPECT_RATIOS: { value: AspectRatio; label: string }[] = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "16:9", label: "Landscape (16:9)" },
  { value: "9:16", label: "Portrait (9:16)" },
  { value: "4:3", label: "Landscape (4:3)" },
  { value: "3:4", label: "Portrait (3:4)" },
];

interface WorkflowSettingsPanelProps {
  workflow: Workflow;
  onContextChange: (context: string) => void;
  onPromptChange: (prompt: string) => void;
  onAspectRatioChange: (aspectRatio: AspectRatio) => void;
  onReferenceImagesChange: (images: string[]) => void;
  onModelChange: (modelId: string, providerId: ProviderKey) => void;
}

export function WorkflowSettingsPanel({
  workflow,
  onContextChange,
  onPromptChange,
  onAspectRatioChange,
  onReferenceImagesChange,
  onModelChange,
}: WorkflowSettingsPanelProps) {
  const [
    workflowReferenceImageIsDragging,
    setWorkflowReferenceImageIsDragging,
  ] = useState<boolean>(false);

  // There might be a race condition on file load
  // Batch load once they are fetched from a DB
  const addReferenceImageFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        onReferenceImagesChange([...workflow.referenceImages, result]);
      }
    };
    reader.onerror = () => {
      console.error(`Failed to read file: ${file.name}`, reader.error);
    };
    reader.readAsDataURL(file);
  };

  const handleWorkflowReferenceImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setWorkflowReferenceImageIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        addReferenceImageFromFile(file);
      }
    });
  };

  const handleWorkflowReferenceImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setWorkflowReferenceImageIsDragging(true);
  };

  const handleWorkflowReferenceImageDragLeave = () => {
    setWorkflowReferenceImageIsDragging(false);
  };

  const handleWorkflowReferenceImageFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        addReferenceImageFromFile(file);
      });
    }
  };

  const handleRemoveReferenceImage = (index: number) => {
    onReferenceImagesChange(
      workflow.referenceImages.filter((_, i) => i !== index)
    );
  };

  const modelSelectItems = useMemo(
    () =>
      PROVIDER_ORDER.flatMap((key) => {
        const provider = PROVIDERS[key];
        return provider.models.map((model) => (
          <SelectItem
            key={`${key}-${model}`}
            value={model}
            className="text-white hover:bg-zinc-700"
          >
            {provider.displayName}
            {": "}
            {imageHelpers.formatModelId(model)}
          </SelectItem>
        ));
      }),
    []
  );

  return (
    <aside className="w-[400px] h-screen bg-zinc-900 border-r border-zinc-800 p-6 pb-20 overflow-y-auto">
      <h3 className="text-white font-semibold mb-4 text-sm">
        {workflow.title}
      </h3>

      <FieldLabel htmlFor="workflow-context">Workflow Context</FieldLabel>
      <Textarea
        rows={3}
        name="workflow-context"
        value={workflow.context}
        onChange={(e) => onContextChange(e.target.value)}
        placeholder="Enter a context for your workflow"
        className="w-full bg-zinc-800 border-zinc-700 text-white resize-none"
      />
      <Separator className="my-4" />

      <FieldLabel htmlFor="workflow-prompt">Prompt</FieldLabel>
      <Textarea
        rows={5}
        name="workflow-prompt"
        value={workflow.prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="Enter a prompt for your workflow"
        className="w-full bg-zinc-800 border-zinc-700 text-white resize-none mb-2"
      />
      <div className="flex justify-end">
        <Button variant="outline" className="hover:bg-zinc-300">
          Improve with AI
        </Button>
      </div>
      <Separator className="my-4" />

      <FieldLabel htmlFor="workflow-aspect-ratio">Aspect Ratio</FieldLabel>
      <div className="flex flex-wrap justify-between gap-2">
        {ASPECT_RATIOS.map((ratio) => (
          <Button
            key={ratio.value}
            variant="outline"
            className={cn(
              "text-zinc-400 border-zinc-700 bg-zinc-800 hover:border-zinc-600 hover:text-zinc-400 hover:bg-zinc-700",
              workflow.aspectRatio === ratio.value
                ? "border-2 border-blue-500"
                : ""
            )}
            onClick={() => onAspectRatioChange(ratio.value as AspectRatio)}
          >
            {ratio.value}
          </Button>
        ))}
      </div>
      <Separator className="my-4" />

      {/* Reference Images */}
      <div>
        <FieldLabel htmlFor="workflow-reference-images">
          Reference Images
        </FieldLabel>

        {/* Display uploaded images */}
        {workflow.referenceImages.length > 0 && (
          <div className="space-y-3 mb-3">
            {workflow.referenceImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Reference ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveReferenceImage(index)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1.5 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload zone - always visible */}
        <div
          onDrop={handleWorkflowReferenceImageDrop}
          onDragOver={handleWorkflowReferenceImageDragOver}
          onDragLeave={handleWorkflowReferenceImageDragLeave}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
            workflowReferenceImageIsDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
          )}
        >
          <input
            type="file"
            id="reference-upload"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            multiple
            onChange={handleWorkflowReferenceImageFileSelect}
            className="hidden"
          />
          <label htmlFor="reference-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
            <p className="text-zinc-400 text-sm">
              {workflow.referenceImages.length > 0
                ? "Upload more reference images"
                : "Upload reference images (optional)"}
            </p>
            <p className="text-zinc-600 text-xs mt-1">PNG, JPG, WEBP</p>
          </label>
        </div>
      </div>
      <Separator className="my-4" />

      {/* Model Selection */}
      <div className="mb-4">
        <FieldLabel htmlFor="workflow-model">Model</FieldLabel>
        <Select
          value={workflow.modelId}
          onValueChange={(model) => {
            const providerKey = PROVIDER_ORDER.find((key) =>
              PROVIDERS[key].models.includes(model)
            );
            if (providerKey) {
              onModelChange(model, providerKey);
            }
          }}
        >
          <SelectTrigger className="w-full border border-zinc-700 bg-zinc-800 text-white px-3 py-2 rounded-md">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectGroup>{modelSelectItems}</SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}
