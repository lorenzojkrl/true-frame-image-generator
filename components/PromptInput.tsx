"use client";

import { useState, useRef } from "react";
import { ArrowUp, Image as ImageIcon, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PROVIDERS, ProviderKey, PROVIDER_ORDER } from "@/lib/provider-config";
import { imageHelpers } from "@/lib/image-helpers";

type QualityMode = "performance" | "quality";

interface PromptInputProps {
  onSubmit: (prompt: string, contextImage?: string) => void;
  isLoading?: boolean;
  showProviders: boolean;
  onToggleProviders: () => void;
  mode: QualityMode;
  onModeChange: (mode: QualityMode) => void;
  selectedModels: Record<ProviderKey, string>;
  onModelChange: (providerKey: ProviderKey, model: string) => void;
  enabledProviders: Record<ProviderKey, boolean>;
  showModelSelector?: boolean;
  activeProvider?: ProviderKey;
  editingImage?: string | null;
}

export function PromptInput({
  isLoading,
  onSubmit,
  selectedModels,
  onModelChange,
  enabledProviders,
  showModelSelector = true,
  activeProvider,
  editingImage,
}: PromptInputProps) {
  const [input, setInput] = useState("");
  const [contextImage, setContextImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!isLoading && input.trim()) {
      onSubmit(input, contextImage || undefined);
      setInput("");
      setContextImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContextImage(reader.result as string);
        setIsDialogOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setContextImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit(input, contextImage || undefined);
      }
    }
  };

  return (
    <div className="w-full mb-8 max-w-[750px] mx-auto">
      <div className="bg-zinc-50 rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              editingImage
                ? "Describe changes to the current image..."
                : "Create with TrueFrame..."
            }
            rows={3}
            className="text-base bg-transparent border-none p-0 resize-none placeholder:text-zinc-500 text-[#111111] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {contextImage && (
            <div className="relative inline-block">
              <img
                src={contextImage}
                alt="Context"
                className="h-16 w-16 object-cover rounded-lg border border-zinc-200"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-black rounded-full p-1 hover:bg-zinc-800"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center justify-between space-x-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-zinc-200 transition-colors duration-200">
                    <ImageIcon className="w-5 h-5 text-zinc-600" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Context Image</DialogTitle>
                    <DialogDescription>
                      Upload an image to use as context for image generation.
                      This can help guide the AI to create images similar to
                      your reference.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-lg p-8 hover:border-zinc-400 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <ImageIcon className="w-12 h-12 text-zinc-400 mb-2" />
                        <span className="text-sm text-zinc-600 mb-1">
                          Click to upload an image
                        </span>
                        <span className="text-xs text-zinc-400">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </label>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center gap-2">
              {showModelSelector && (
                <Select
                  value={
                    activeProvider
                      ? selectedModels[activeProvider]
                      : Object.values(selectedModels)[0]
                  }
                  onValueChange={(model) => {
                    // Update logic for single model selection
                    const providerKey = Object.keys(PROVIDERS).find((key) =>
                      PROVIDERS[key as ProviderKey].models.includes(model)
                    ) as ProviderKey;
                    if (providerKey) {
                      onModelChange(providerKey, model);
                    }
                  }}
                >
                  <SelectTrigger className="h-8 w-[180px] text-xs">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER_ORDER.filter((key) => enabledProviders[key]).map(
                      (providerKey) => {
                        const provider = PROVIDERS[providerKey];
                        return (
                          <SelectGroup key={providerKey}>
                            <SelectLabel>{provider.displayName}</SelectLabel>
                            {provider.models.map((model) => (
                              <SelectItem key={model} value={model}>
                                {imageHelpers.formatModelId(model)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        );
                      }
                    )}
                  </SelectContent>
                </Select>
              )}
              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="h-8 w-8 rounded-full bg-black flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <Spinner className="w-3 h-3 text-white" />
                ) : (
                  <ArrowUp className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
