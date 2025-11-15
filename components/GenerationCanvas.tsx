"use client";

import { Download, Share, Loader2 } from "lucide-react";
import { imageHelpers } from "@/lib/image-helpers";
import { Button } from "@/components/ui/button";

interface GenerationCanvasProps {
  image: string | null;
  isLoading: boolean;
  provider: string;
}

export function GenerationCanvas({
  image,
  isLoading,
  provider,
}: GenerationCanvasProps) {
  const handleActionClick = (imageData: string, provider: string) => {
    imageHelpers.shareOrDownload(imageData, provider).catch((error) => {
      console.error("Failed to share/download image:", error);
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-zinc-950 p-8">
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-zinc-400 text-sm">Generating your image...</p>
        </div>
      ) : image ? (
        <div className="relative group max-w-4xl max-h-full">
          <img
            src={`data:image/png;base64,${image}`}
            alt="Generated"
            className="max-w-full max-h-[calc(100vh-500px)] object-contain rounded-lg"
          />
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="bg-black/70 hover:bg-black/90"
              onClick={() => handleActionClick(image, provider)}
            >
              <span className="sm:hidden">
                <Share className="h-4 w-4" />
              </span>
              <span className="hidden sm:block">
                <Download className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-zinc-500 text-lg">No image generated yet</p>
          <p className="text-zinc-600 text-sm mt-2">
            Enter a prompt below to get started
          </p>
        </div>
      )}
    </div>
  );
}
