"use client";

import { cn } from "@/lib/utils";
import { Download, Share } from "lucide-react";
import { imageHelpers } from "@/lib/image-helpers";

interface GeneratedImage {
  id: string;
  image: string;
  timestamp: number;
  provider: string;
  modelId: string;
}

interface ImageThumbnailCarouselProps {
  images: GeneratedImage[];
  selectedImageId: string | null;
  onImageSelect: (id: string) => void;
}

export function ImageThumbnailCarousel({
  images,
  selectedImageId,
  onImageSelect,
}: ImageThumbnailCarouselProps) {
  if (images.length === 0) return null;

  const handleActionClick = (
    e: React.MouseEvent,
    imageData: string,
    provider: string
  ) => {
    e.stopPropagation();
    imageHelpers.shareOrDownload(imageData, provider).catch((error) => {
      console.error("Failed to share/download image:", error);
    });
  };

  return (
    <div className="w-full bg-zinc-900 border-t border-zinc-800 p-4">
      <div className="flex gap-3 overflow-x-auto">
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => onImageSelect(img.id)}
            className={cn(
              "relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer transition-all group",
              selectedImageId === img.id
                ? "ring-2 ring-blue-500"
                : "ring-1 ring-zinc-700 hover:ring-zinc-600"
            )}
          >
            <img
              src={`data:image/png;base64,${img.image}`}
              alt="Generated"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
            <button
              onClick={(e) => handleActionClick(e, img.image, img.provider)}
              className="absolute bottom-1 right-1 bg-black/70 hover:bg-black/90 rounded-md p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="sm:hidden">
                <Share className="h-3 w-3 text-white" />
              </span>
              <span className="hidden sm:block">
                <Download className="h-3 w-3 text-white" />
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
