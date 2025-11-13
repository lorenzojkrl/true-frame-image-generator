import { ProviderKey } from "./provider-config";

export interface GenerateImageRequest {
  prompt: string;
  provider: ProviderKey;
  modelId: string;
  referenceImage?: string;
}

export interface GenerateImageResponse {
  image?: string;
  error?: string;
}
