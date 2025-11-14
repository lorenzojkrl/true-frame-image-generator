import { ProviderKey } from "./provider-config";

export interface GenerateImageRequest {
  prompt: string;
  provider: ProviderKey;
  modelId: string;
  referenceImage?: string; // For style transfer
  editingImage?: string; // For editing the current image
}

export interface GenerateImageResponse {
  image?: string;
  error?: string;
}
