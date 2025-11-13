"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PROVIDERS, ProviderKey, PROVIDER_ORDER } from "@/lib/provider-config";
import { imageHelpers } from "@/lib/image-helpers";
import { cn } from "@/lib/utils";

interface GenerationSidebarProps {
  selectedModel: string;
  selectedProvider: ProviderKey;
  onModelChange: (model: string) => void;
  onProviderChange: (provider: ProviderKey) => void;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  referenceImage: string | null;
  onReferenceImageChange: (image: string | null) => void;
}

const ASPECT_RATIOS = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "16:9", label: "Landscape (16:9)" },
  { value: "9:16", label: "Portrait (9:16)" },
  { value: "4:3", label: "Landscape (4:3)" },
  { value: "3:4", label: "Portrait (3:4)" },
];

export function GenerationSidebar({
  selectedModel,
  selectedProvider,
  onModelChange,
  onProviderChange,
  aspectRatio,
  onAspectRatioChange,
  referenceImage,
  onReferenceImageChange,
}: GenerationSidebarProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/)) {
      alert("Please upload a PNG, JPG, or WEBP image");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onReferenceImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const provider = PROVIDERS[selectedProvider];

  return (
    <aside className="w-[320px] h-screen bg-zinc-900 border-r border-zinc-800 p-6 overflow-y-auto">
      {/* General Settings */}
      <div className="mb-8">
        <h3 className="text-white font-semibold mb-4 text-sm">
          General settings
        </h3>

        {/* Model Selection */}
        <div className="mb-4">
          <Label className="text-zinc-400 text-xs mb-2 block">Model</Label>
          <Select
            value={selectedModel}
            onValueChange={(model) => {
              const providerKey = PROVIDER_ORDER.find((key) =>
                PROVIDERS[key].models.includes(model)
              );
              if (providerKey) {
                onProviderChange(providerKey);
                onModelChange(model);
              }
            }}
          >
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {PROVIDER_ORDER.map((key) => {
                  const provider = PROVIDERS[key];
                  return provider.models.map((model) => (
                    <SelectItem key={`${key}-${model}`} value={model}>
                      {provider.displayName}
                      {": "}
                      {imageHelpers.formatModelId(model)}
                    </SelectItem>
                  ));
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Aspect Ratio */}
        <div className="mb-4">
          <Label className="text-zinc-400 text-xs mb-2 block">
            Aspect ratio
          </Label>
          <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    {ratio.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reference Image */}
      <div>
        <h3 className="text-white font-semibold mb-4 text-sm">
          Reference image
        </h3>

        {referenceImage ? (
          <div className="relative">
            <img
              src={referenceImage}
              alt="Reference"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={() => onReferenceImageChange(null)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1.5 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragging
                ? "border-blue-500 bg-blue-500/10"
                : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
            )}
          >
            <input
              type="file"
              id="reference-upload"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="reference-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
              <p className="text-zinc-400 text-sm">
                Drop image here or click to upload
              </p>
              <p className="text-zinc-600 text-xs mt-1">PNG, JPG, WEBP</p>
            </label>
          </div>
        )}
      </div>
    </aside>
  );
}
