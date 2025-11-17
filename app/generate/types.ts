import { ProviderKey } from "@/lib/provider-config";

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export interface Workflow {
  id: number;
  title: string;
  context: string;
  prompt: string;
  aspectRatio: AspectRatio;
  referenceImages: string[];
  modelId: string;
  providerId: ProviderKey;
}
